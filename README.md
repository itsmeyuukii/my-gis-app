# GIS Map Viewer with GeoJSON Integration

This project is a GIS (Geographic Information System) map viewer built with React, TypeScript, and Vite. It dynamically fetches and displays GeoJSON data on a map. The GeoJSON API is deployed on Render.com and is part of the repository [`itsmeyuukii/geojson-api`](https://github.com/itsmeyuukii/geojson-api).

---

## 🚀 Features

- **Dynamic GeoJSON Rendering**: Fetch and display GeoJSON data on the map with a single button click.
- **Customizable Map**: Uses MapLibre GL with a Carto Positron base map.
- **Dynamic Styling**: GeoJSON points are styled based on their `status` property.
- **API Integration**: Fetches GeoJSON data from a REST API deployed on Render.com.

---

## 📂 Project Structure

### Key Files:
- **`src/components/Map/MapView.tsx`**: The map component that renders the map and handles GeoJSON layers.
- **`src/view/Layout.tsx`**: The layout component that includes the map and the "Get GeoJSON" button.

---

## 🌐 GeoJSON API

The GeoJSON API is deployed on Render.com and is part of the repository [`itsmeyuukii/geojson-api`](https://github.com/itsmeyuukii/geojson-api).

### API Endpoint:
```
https://geojson-api-9ev1.onrender.com/api/projects/geojson
```

### Example Response:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [121.034, 14.5995]
      },
      "properties": {
        "id": 1,
        "name": "Road Improvement Project",
        "status": "Ongoing",
        "year": 2025
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [120.984, 14.676]
      },
      "properties": {
        "id": 2,
        "name": "Bridge Construction",
        "status": "Planned",
        "year": 2026
      }
    }
  ]
}
```

---

## 🗺️ How It Works

### 1. **Map Initialization**
The `MapView` component initializes a MapLibre map with the Carto Positron base map.

### 2. **Fetching GeoJSON**
When the "Get GeoJSON" button is clicked:
- The `Layout` component calls the `addGeoJsonLayer` method in `MapView`.
- The `addGeoJsonLayer` method fetches GeoJSON data from the API.

### 3. **Rendering GeoJSON**
The GeoJSON data is added to the map as a `circle` layer:
- **Blue**: Ongoing projects
- **Yellow**: Planned projects
- **Red**: Default for other statuses

---

## 🛠️ Setup Instructions

### 1. **Clone the Repository**
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Environment Variables**
Create a `.env` file in the root of your project and add the following:
```env
VITE_API_BASE_URL=https://geojson-api-9ev1.onrender.com/api/projects/geojson
```

### 4. **Run the Development Server**
```bash
npm run dev
```

---

## 🖼️ Screenshots

### Map with GeoJSON Data:
![Map with GeoJSON Data](https://via.placeholder.com/800x400?text=Map+with+GeoJSON+Data)

---

## 📦 Dependencies

- **React**: Frontend framework
- **MapLibre GL**: Map rendering library
- **Axios**: HTTP client for API requests
- **Vite**: Build tool for fast development

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 🌟 Acknowledgments

- **[MapLibre GL](https://maplibre.org/)** for the map rendering library.
- **[Render.com](https://render.com/)** for hosting the GeoJSON API.
- **[itsmeyuukii/geojson-api](https://github.com/itsmeyuukii/geojson-api)** for the GeoJSON API repository.

---

## 📬 Contact

For questions or support, please contact [your-email@example.com].