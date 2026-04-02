import pickle
import json

# Load model.pkl
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

# Load scaler.pkl
with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Load metadata
with open('model_metadata.json', 'r') as f:
    metadata = json.load(f)

print(" MODEL INSPECTION ")
print(f"Model Type: {type(model)}")
print(f"Classes: {model.classes_}")
print(f"Class Priors: {model.class_prior_}")
print(f"Feature Means (theta_): {model.theta_}")
print(f"Feature Variances (var_): {model.var_}")

print("\n SCALER INSPECTION ")
print(f"Scaler Type: {type(scaler)}")
print(f"Feature Means: {scaler.mean_}")
print(f"Feature Scales: {scaler.scale_}")
print(f"Feature Variances: {scaler.var_}")

print("\n METADATA ANALYSIS ")
print(f"Model Name: {metadata['model_name']}")
print(f"Accuracy: {metadata['accuracy']:.4f}")
print(f"F1 Macro: {metadata['f1_macro']:.4f}")
print(f"Number of Classes: {metadata['n_classes']}")
print(f"Class Labels: {metadata['class_labels']}")
print(f"Per-Class Accuracy: {metadata['per_class_accuracy']}")
print(f"Trained on: {metadata['trained_on']}")
print(f"Features ({metadata['features_count']}): {metadata['features']}")
print(f"Dataset: {metadata['dataset_source']}")
print(f"Training Date: {metadata['training_date']}")
print(f"Description: {metadata['description']}")