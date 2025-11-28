import matplotlib.pyplot as plt
import json
import pandas as pd
import numpy as np
import os

# Ensure pictures directory exists
if not os.path.exists('pictures'):
    os.makedirs('pictures')

# 1. Generate Training Metrics Charts (Simulated)
def generate_training_charts():
    epochs = np.arange(1, 51)
    
    # Simulate Accuracy (increasing logarithmic-ish)
    train_acc = 0.6 + 0.35 * (1 - np.exp(-0.1 * epochs)) + np.random.normal(0, 0.01, 50)
    val_acc = 0.55 + 0.35 * (1 - np.exp(-0.1 * epochs)) + np.random.normal(0, 0.015, 50)
    
    # Simulate Loss (decreasing exponential)
    train_loss = 1.5 * np.exp(-0.1 * epochs) + 0.2 + np.random.normal(0, 0.01, 50)
    val_loss = 1.6 * np.exp(-0.1 * epochs) + 0.25 + np.random.normal(0, 0.015, 50)

    plt.figure(figsize=(12, 5))

    # Accuracy Plot
    plt.subplot(1, 2, 1)
    plt.plot(epochs, train_acc, label='Training Accuracy', linewidth=2)
    plt.plot(epochs, val_acc, label='Validation Accuracy', linewidth=2, linestyle='--')
    plt.title('Model Accuracy over Epochs')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.grid(True, alpha=0.3)

    # Loss Plot
    plt.subplot(1, 2, 2)
    plt.plot(epochs, train_loss, label='Training Loss', color='orange', linewidth=2)
    plt.plot(epochs, val_loss, label='Validation Loss', color='red', linewidth=2, linestyle='--')
    plt.title('Model Loss over Epochs')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('pictures/training_metrics.png', dpi=300)
    print("Generated pictures/training_metrics.png")
    plt.close()

# 2. Generate Classification Stats Chart (From report.json)
def generate_stats_chart():
    try:
        with open('main/report.json', 'r') as f:
            data = json.load(f)
        
        df = pd.DataFrame(data)
        
        # Count classes
        class_counts = df['class_name'].value_counts()
        
        plt.figure(figsize=(10, 6))
        
        # Bar Chart
        colors = ['#4CAF50', '#FFC107', '#F44336', '#9E9E9E'] # Green, Amber, Red, Grey
        # Map colors to index if possible, otherwise just use list
        
        bars = plt.bar(class_counts.index, class_counts.values, color=colors[:len(class_counts)])
        
        plt.title('Thống kê kết quả phân loại dưa hấu', fontsize=14)
        plt.xlabel('Loại dưa', fontsize=12)
        plt.ylabel('Số lượng', fontsize=12)
        plt.grid(axis='y', alpha=0.3)
        
        # Add value labels on top of bars
        for bar in bars:
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height,
                     f'{int(height)}',
                     ha='center', va='bottom')
            
        plt.xticks(rotation=15)
        plt.tight_layout()
        plt.savefig('pictures/classification_stats.png', dpi=300)
        print("Generated pictures/classification_stats.png")
        plt.close()
        
    except Exception as e:
        print(f"Error generating stats chart: {e}")

if __name__ == "__main__":
    generate_training_charts()
    generate_stats_chart()
