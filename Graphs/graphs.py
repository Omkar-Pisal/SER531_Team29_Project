import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load Alzheimer Dataset
alzheimer_df = pd.read_csv('Alzheimer_s_Disease_and_Healthy_Aging_Data.csv')

# Plot a bar chart for the distribution of 'Data_Value' in the Alzheimer Dataset
plt.figure(figsize=(10, 6))
sns.barplot(x='Stratification1', y='Data_Value', data=alzheimer_df)
plt.title('Distribution of Data_Value in Alzheimer Dataset')
plt.xlabel('Stratification1')
plt.ylabel('Data_Value')
plt.savefig('alzheimer_plot.png')  # Save the plot as an image
plt.close()  # Close the current figure to free up resources

# Load Covid Dataset
covid_df = pd.read_csv('Covid Data.csv')

# Plot a countplot for the 'PATIENT_TYPE' in the Covid Dataset
plt.figure(figsize=(8, 6))
sns.countplot(x='PATIENT_TYPE', data=covid_df)
plt.title('Count of Patient Types in Covid Dataset')
plt.xlabel('Patient Type')
plt.ylabel('Count')
plt.savefig('covid_plot.png')  # Save the plot as an image
plt.close()  # Close the current figure to free up resources

# Load Cardiovascular Dataset with semicolon as the delimiter
cardiovascular_df = pd.read_csv('cardiovascular_diseases_dv3.csv', delimiter=';')

# Convert 'AGE' column to numeric
cardiovascular_df['AGE'] = pd.to_numeric(cardiovascular_df['AGE'], errors='coerce')

# Plot a scatter plot for 'AGE' vs 'AP_HIGH' in the Cardiovascular Dataset
plt.figure(figsize=(10, 6))
sns.scatterplot(x='AGE', y='AP_HIGH', data=cardiovascular_df)
plt.title('Scatter Plot of Age vs High Blood Pressure')
plt.xlabel('Age')
plt.ylabel('High Blood Pressure')
plt.savefig('cardiovascular_plot.png')  # Save the plot as an image
plt.close()  # Close the current figure to free up resources
