import os
import json
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify, render_template
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import joblib

app = Flask(__name__, static_folder='.', static_url_path='')

# Load the trained model and scaler if they exist, otherwise train a new one
model_path = 'fraud_detection_model.pkl'
scaler_path = 'fraud_detection_scaler.pkl'

# Function to train or load the fraud detection model
def get_fraud_detection_model():
    # Check if we have a pre-trained model
    if os.path.exists(model_path) and os.path.exists(scaler_path):
        print("Loading existing fraud detection model...")
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        return model, scaler
    else:
        print("Training new fraud detection model...")
        # Try to load the dataset
        try:
            dataset_path = 'train.csv'
            df = pd.read_csv(dataset_path)
            
            # Prepare features and target
            X = df.drop('isFraud', axis=1)
            y = df['isFraud']
            
            # Standardize features
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            
            # Train a logistic regression model
            model = LogisticRegression(random_state=42, max_iter=1000)
            model.fit(X_scaled, y)
            
            # Save the model and scaler for future use
            joblib.dump(model, model_path)
            joblib.dump(scaler, scaler_path)
            
            print("Model trained and saved successfully.")
            return model, scaler
        except Exception as e:
            print(f"Error training model: {e}")
            # Create a simple dummy model for demonstration purposes
            return create_dummy_model()

# Create a dummy model for demonstration when no dataset is available
def create_dummy_model():
    print("Creating a dummy fraud detection model for demonstration...")
    # Simple model that flags transactions with certain patterns
    class DummyFraudModel:
        def predict(self, X):
            # In this dummy implementation:
            # - Flag transactions over $1000 as potentially fraudulent
            # - Flag transactions with card numbers starting with "1234" as suspicious
            results = []
            for transaction in X:
                # Assume transaction[0] is amount and transaction[1] is card number
                amount = transaction[0] if len(transaction) > 0 else 0
                card_num = str(transaction[1]) if len(transaction) > 1 else ""
                
                if amount > 1000 or (len(card_num) >= 4 and card_num[:4] == "1234"):
                    results.append(1)  # Fraudulent
                else:
                    results.append(0)  # Normal
            return np.array(results)
    
    class DummyScaler:
        def transform(self, X):
            # Just pass through the data for demonstration
            return np.array(X)
    
    return DummyFraudModel(), DummyScaler()

# Initialize the model
model, scaler = get_fraud_detection_model()

# Routes for serving static files
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def serve_static(path):
    return app.send_static_file(path)

# API endpoint for payment processing with fraud detection
@app.route('/api/process-payment', methods=['POST'])
def process_payment():
    try:
        # Get payment data from the request
        payment_data = request.json
        
        # Extract relevant features for fraud detection
        # In a real application, you would need to match these to your model's expected inputs
        features = extract_features_from_payment(payment_data)
        
        # Scale the features
        scaled_features = scaler.transform([features])
        
        # Predict if the transaction is fraudulent
        prediction = model.predict(scaled_features)
        
        # Get the result (0 = normal, 1 = fraud)
        is_fraud = prediction[0] == 1
        
        if is_fraud:
            # If transaction is flagged as fraud, reject it
            return jsonify({
                "success": False,
                "message": "This transaction has been flagged for security reasons. Please contact customer support."
            })
        else:
            # If transaction seems legitimate, process the payment
            # In a real app, this would integrate with a payment gateway
            order_number = 'RK' + str(np.random.randint(100000, 999999))
            
            return jsonify({
                "success": True,
                "orderNumber": order_number,
                "message": "Payment processed successfully!"
            })
            
    except Exception as e:
        print(f"Error processing payment: {e}")
        return jsonify({
            "success": False,
            "message": "An error occurred while processing your payment. Please try again."
        }), 500

# Extract relevant features from payment data for fraud detection
def extract_features_from_payment(payment_data):
    # In a real application, this would extract the appropriate features
    # based on your model's training data
    
    # For our demonstration, we'll extract simple features:
    # 1. Transaction amount
    # 2. Card number (last 4 digits converted to an integer)
    # 3. Time of day (hour as a number)
    # 4. Whether billing address and shipping address match (1 = yes, 0 = no)
    
    amount = payment_data.get('amount', 0)
    
    # Extract last 4 digits of card number, or use 0 if not available
    card_number = payment_data.get('cardNumber', '')
    last_four = int(card_number[-4:]) if card_number and len(card_number) >= 4 else 0
    
    # Extract hour from timestamp
    timestamp = payment_data.get('timestamp', '')
    hour = 12  # Default to noon if timestamp not available
    if timestamp:
        try:
            from datetime import datetime
            dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            hour = dt.hour
        except:
            pass
    
    # For demo purposes, always use 1 (addresses match)
    addresses_match = 1
    
    # Return features as a list
    return [amount, last_four, hour, addresses_match]

# Add a health check endpoint
@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "timestamp": pd.Timestamp.now().isoformat()})

# Run the app
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)