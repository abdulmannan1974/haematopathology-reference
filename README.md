# 🔬 Haematopathology Reference

An interactive, mobile-friendly reference tool for molecular and cytogenetic information in haematological malignancies. Based on the Association for Molecular Pathology (AMP) Guidelines.

![Haematopathology Reference](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![React](https://img.shields.io/badge/React-18+-61DAFB)

## Features

### Core Functionality
- **Comprehensive Database**: 60+ haematological entities covering AML, MDS, MPN, B-cell neoplasms, T-cell neoplasms, and other disorders
- **Search**: Real-time search across disease names, genes, and clinical features
- **Prognosis Stratification**: Color-coded cards (green/yellow/red) for quick risk assessment

### User Features
- **Favorites**: Star diseases for quick access, stored locally
- **Compare Mode**: Side-by-side comparison of up to 3 diseases
- **Recent Searches**: Quick access to your search history

### Export Options
- **JSON Export**: Backup and transfer your favorites
- **Text Export**: Plain text for notes and documentation
- **Print/PDF**: Formatted output for printing
- **Clipboard**: Quick sharing via WhatsApp, email, etc.

### Technical Features
- **Progressive Web App**: Works offline once loaded
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Local Storage**: Your preferences persist between sessions
- **No Account Required**: All data stored locally

## Categories Covered

| Category | Description | Entities |
|----------|-------------|----------|
| 🔴 AML | Acute Myeloid Leukemia | 15+ |
| 🟡 MDS | Myelodysplastic Syndromes | 8+ |
| 🟢 MPN | Myeloproliferative Neoplasms | 6+ |
| 🔵 B-cell | B-cell Neoplasms | 17+ |
| 🟣 T-cell | T-cell Neoplasms | 8+ |
| ⚪ Other | Other Haematological Disorders | 8+ |

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/haematopathology-reference.git

# Navigate to project directory
cd haematopathology-reference

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment.

## Deployment

### GitHub Pages

1. Update `vite.config.js` base URL if needed:
   ```js
   base: '/haematopathology-reference/'
   ```

2. Build and deploy:
   ```bash
   npm run build
   ```

3. Push the `dist` folder to `gh-pages` branch

### Vercel / Netlify

Simply connect your repository - these platforms auto-detect Vite projects.

### Static Hosting

Upload the contents of `dist` folder to any static hosting service.

## Usage Guide

### Searching
- Use the search bar to find diseases, genes, or features
- Search is case-insensitive and matches partial text

### Favorites
- Click the ⭐ icon to add/remove favorites
- Click the star button in the search bar to filter favorites
- Favorites persist in your browser's local storage

### Compare Mode
- Click "Compare" to enter comparison mode
- Select up to 3 diseases to compare side-by-side
- Click again to exit compare mode

### Exporting
- Click "Export" to see export options
- JSON format can be re-imported later
- Text and PDF formats are for reference/documentation

## Data Sources

Content is based on:
- Association for Molecular Pathology (AMP) Guidelines
- WHO Classification of Tumours of Haematopoietic and Lymphoid Tissues
- ELN 2022 AML Risk Stratification
- IPSS-R/IPSS-M for MDS

**Revised: July 2025**

## Disclaimer

⚠️ **This is a clinical reference tool for professional use only.**

This application is intended as a quick reference guide for healthcare professionals. It should not be used as the sole basis for clinical decision-making. Always verify information with current guidelines and institutional protocols.

**Not for diagnostic purposes.**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Dr Abdul Mannan** (Blood Doctor)
- Consultant Haematologist
- Director, Bangor Haemophilia Centre
- Thrombosis Lead & Haematology Laboratory Lead, Betsi Cadwaladr University Health Board

## Acknowledgments

- Association for Molecular Pathology (AMP) for guideline content
- React and Vite teams for excellent tooling
- Tailwind CSS for styling framework
- Lucide for beautiful icons

---

Made with ❤️ for the haematology community
