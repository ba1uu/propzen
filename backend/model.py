import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score
import joblib, os

def generate_data():
    np.random.seed(42)
    n = 8000
    cities = {
        'Hyderabad': {'lat': 17.385, 'lng': 78.487, 'base': 65},
        'Bangalore':  {'lat': 12.972, 'lng': 77.594, 'base': 90},
        'Mumbai':     {'lat': 19.076, 'lng': 72.877, 'base': 130},
        'Delhi':      {'lat': 28.704, 'lng': 77.102, 'base': 100},
        'Chennai':    {'lat': 13.083, 'lng': 80.270, 'base': 72},
        'Pune':       {'lat': 18.520, 'lng': 73.856, 'base': 75},
        'Kolkata':    {'lat': 22.572, 'lng': 88.363, 'base': 55},
        'Ahmedabad':  {'lat': 23.023, 'lng': 72.572, 'base': 52},
        'Jaipur':     {'lat': 26.912, 'lng': 75.787, 'base': 48},
        'Surat':      {'lat': 21.170, 'lng': 72.831, 'base': 50},
    }
    names = list(cities.keys())
    rows = []
    for _ in range(n):
        c = np.random.choice(names)
        info = cities[c]
        b = info['base']
        area = np.random.randint(300, 4000)
        bhk = np.random.choice([1,2,3,4,5], p=[0.10,0.35,0.35,0.15,0.05])
        baths = min(bhk, np.random.randint(1, bhk+2))
        yr = np.random.randint(1990, 2024)
        age = 2024 - yr
        park = np.random.choice([0,1], p=[0.3,0.7])
        lift = np.random.choice([0,1], p=[0.4,0.6])
        loc = np.random.randint(1,6)
        flr = np.random.randint(0,20)
        furn = np.random.choice([0,1,2], p=[0.3,0.4,0.3])
        lat = info['lat'] + np.random.uniform(-0.3,0.3)
        lng = info['lng'] + np.random.uniform(-0.3,0.3)
        price = (b*0.4 + (area/100)*(b*0.08) + bhk*(b*0.5) +
                 loc*(b*0.15) + park*3 + lift*2 + furn*4 -
                 age*0.3 + flr*0.5 + np.random.normal(0, b*0.1))
        price = max(price, 8)
        rows.append([area,bhk,baths,age,park,lift,loc,flr,furn,lat,lng,round(price,2)])

    df = pd.DataFrame(rows, columns=[
        'area_sqft','bhk','bathrooms','age','parking','lift',
        'location_rating','floor','furnished','latitude','longitude','price_lakhs'])
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/housing.csv', index=False)
    print(f"Dataset: {len(df)} rows")
    return df

def train():
    df = generate_data()
    feature_cols = ['area_sqft','bhk','bathrooms','age','parking','lift',
                    'location_rating','floor','furnished','latitude','longitude']
    X, y = df[feature_cols], df['price_lakhs']
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
    print("Training model...")
    model = Pipeline([
        ('sc', StandardScaler()),
        ('rf', RandomForestRegressor(n_estimators=150, max_depth=15, random_state=42, n_jobs=-1))
    ])
    model.fit(Xtr, ytr)
    yp = model.predict(Xte)
    print(f"R2: {r2_score(yte,yp):.4f} | MAE: {mean_absolute_error(yte,yp):.2f}L")
    joblib.dump(model, 'model.pkl')
    joblib.dump(feature_cols, 'features.pkl')
    print("Done! model.pkl saved.")

if __name__ == '__main__':
    train()