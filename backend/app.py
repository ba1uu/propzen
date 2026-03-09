from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, pandas as pd, json, os

app = Flask(__name__)
CORS(app)

USERS_FILE = 'users.json'
def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE) as f: return json.load(f)
    return {}
def save_users(u):
    with open(USERS_FILE,'w') as f: json.dump(u,f)

print("Loading model...")
model = joblib.load('model.pkl')
feature_cols = joblib.load('features.pkl')
print("Ready!")

def fmt(lakhs):
    return f"₹{lakhs/100:.2f} Cr" if lakhs >= 100 else f"₹{lakhs:.1f} L"

@app.route('/api/register', methods=['POST'])
def register():
    d = request.get_json()
    users = load_users()
    email = d.get('email','').lower().strip()
    if not d.get('name') or not email or not d.get('password'):
        return jsonify({'success':False,'error':'All fields required'}),400
    if email in users:
        return jsonify({'success':False,'error':'Email already registered'}),400
    users[email] = {'name':d['name'],'password':d['password'],'profile':None}
    save_users(users)
    return jsonify({'success':True,'name':d['name']})

@app.route('/api/login', methods=['POST'])
def login():
    d = request.get_json()
    users = load_users()
    email = d.get('email','').lower().strip()
    if email not in users: return jsonify({'success':False,'error':'Email not found'}),401
    if users[email]['password'] != d.get('password'):
        return jsonify({'success':False,'error':'Wrong password'}),401
    return jsonify({'success':True,'name':users[email]['name'],'email':email,
                    'hasProfile':users[email]['profile'] is not None,
                    'profile':users[email]['profile']})

@app.route('/api/profile', methods=['POST'])
def profile():
    d = request.get_json()
    users = load_users()
    email = d.get('email','').lower()
    if email not in users: return jsonify({'success':False,'error':'Not found'}),404
    users[email]['profile'] = {k:d.get(k) for k in ['phone','age','occupation','income','city','purpose']}
    save_users(users)
    return jsonify({'success':True})

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        d = request.get_json()
        age = 2024 - int(d.get('yearBuilt',2010))
        inp = {
            'area_sqft':float(d.get('areaSqft',1000)),
            'bhk':int(d.get('bhk',2)),
            'bathrooms':int(d.get('bathrooms',2)),
            'age':age,
            'parking':int(d.get('parking',1)),
            'lift':int(d.get('lift',1)),
            'location_rating':int(d.get('locationRating',3)),
            'floor':int(d.get('floor',2)),
            'furnished':int(d.get('furnished',1)),
            'latitude':float(d.get('latitude',17.385)),
            'longitude':float(d.get('longitude',78.487)),
        }
        price = max(round(float(model.predict(pd.DataFrame([inp]))[0]),1), 5.0)
        sqft = round((price*100000)/inp['area_sqft'])

        tips = []
        income = float(d.get('income',0) or 0)
        if income > 0:
            emi = price*100000*0.007
            tips.append({'icon':'💳','title':'EMI Estimate','text':f"Approx EMI: ₹{emi:,.0f}/mo ({emi/(income/12)*100:.0f}% of monthly income). Keep it under 40%.","type":'info'})
        if inp['age'] > 20:
            tips.append({'icon':'🔧','title':'Older Property','text':'Over 20 years old. Budget ₹2–5L for renovation.','type':'warning'})
        if inp['location_rating'] <= 2:
            tips.append({'icon':'📍','title':'Location Alert','text':'Low rating affects resale. Consider 3+ rated areas.','type':'warning'})
        else:
            tips.append({'icon':'📈','title':'Great Location','text':'Prime location — expect 8–12% annual appreciation.','type':'success'})
        if inp['furnished'] == 0:
            tips.append({'icon':'🛋️','title':'Furnishing Cost','text':'Budget ₹3–8L for furniture and fittings.','type':'info'})
        if inp['parking'] == 0:
            tips.append({'icon':'🚗','title':'No Parking','text':'Reduces resale by 5–8% in metro cities.','type':'warning'})
        tips.append({'icon':'📋','title':'Legal Checklist','text':'Verify RERA, EC, Khata, and OC before buying.','type':'info'})
        tips.append({'icon':'🏛️','title':'Stamp Duty','text':f"Stamp duty ~6% = ₹{price*0.06:.1f}L. Registration ~1% = ₹{price*0.01:.1f}L.","type":'info'})
        if d.get('purpose') == 'invest':
            tips.append({'icon':'🏦','title':'Rental Yield','text':f"Expected monthly rent: ₹{price*3000:,.0f}. Yield ~3–4%.","type":'success'})

        return jsonify({'success':True,'price_lakhs':price,'formatted_price':fmt(price),'price_per_sqft':sqft,'suggestions':tips})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)}),400

if __name__ == '__main__':
    print("Server at http://localhost:5000")
    app.run(debug=True, port=5000)