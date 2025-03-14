import pandas as pd
import json

# Read the Excel file
excel_file = "DDM Order Form.xlsx"
xls = pd.ExcelFile(excel_file)

# Get all sheet names
sheet_names = xls.sheet_names
print(f"Sheet names: {sheet_names}")

# Analyze all sheets
all_sheets_data = {}

for sheet_name in sheet_names:
    print(f"\n\nAnalyzing sheet: {sheet_name}")
    try:
        df = pd.read_excel(excel_file, sheet_name=sheet_name)
        
        # Print basic info
        print(f"Number of rows: {len(df)}")
        print(f"Number of columns: {len(df.columns)}")
        
        # Print column names
        print("Column names:")
        print(df.columns.tolist())
        
        # Store data for JSON
        all_sheets_data[sheet_name] = {
            "columns": df.columns.tolist(),
            "sample_data": df.head(3).to_dict(orient="records")
        }
        
    except Exception as e:
        print(f"Error reading sheet {sheet_name}: {e}")

# Save all structure to JSON for web app development
with open("all_sheets_structure.json", "w") as f:
    json.dump(all_sheets_data, f, indent=2, default=str)

print("\nAll sheets structure saved to all_sheets_structure.json") 