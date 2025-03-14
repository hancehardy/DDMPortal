# DDM Cabinet Door Portal

A web application for ordering custom cabinet doors based on the DDM Order Form Excel file.

## Features

- User-friendly interface for ordering cabinet doors
- Form layout similar to the original Excel order form
- Customer information management
- Order details configuration
- Item-based ordering with various options (hinges, glass, etc.)
- Order summary and submission

## Technology Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ddm-portal.git
cd ddm-portal
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app`: Next.js app router pages
- `/src/components`: React components
- `/src/context`: React context for state management
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions
- `/public/data`: Data files extracted from Excel

## Data Source

The application uses data extracted from the "DDM Order Form.xlsx" Excel file. The data is processed and stored in JSON format for use in the web application.

## Future Enhancements

- User authentication and account management
- Order history and tracking
- Price calculation based on selections
- Admin dashboard for order management
- Email notifications for order status updates

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- DDM Cabinet Doors for the original order form design
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework 