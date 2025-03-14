import pandas as pd
import json

# Read the Excel file
excel_file = "DDM Order Form.xlsx"
xls = pd.ExcelFile(excel_file)

# Get all sheet names
sheet_names = xls.sheet_names
print(f"Sheet names: {sheet_names}")

# Analyze the "Order Form" sheet
if "Order Form" in sheet_names:
    df = pd.read_excel(excel_file, sheet_name="Order Form")
    
    # Print basic info
    print("\nOrder Form Sheet Structure:")
    print(f"Number of rows: {len(df)}")
    print(f"Number of columns: {len(df.columns)}")
    
    # Print column names
    print("\nColumn names:")
    print(df.columns.tolist())
    
    # Print first few rows to understand structure
    print("\nFirst 5 rows sample:")
    print(df.head(5).to_string())
    
    # Save structure to JSON for web app development
    structure = {
        "sheet_names": sheet_names,
        "order_form": {
            "columns": df.columns.tolist(),
            "sample_data": df.head(5).to_dict(orient="records")
        }
    }
    
    with open("excel_structure.json", "w") as f:
        json.dump(structure, f, indent=2, default=str)
    
    print("\nStructure saved to excel_structure.json")
else:
    print("No 'Order Form' sheet found in the Excel file.") 