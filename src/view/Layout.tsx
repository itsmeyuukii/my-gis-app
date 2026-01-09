import React from "react";
import MapView from "../components/Map/MapView";

const Layout: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
        {/* Final Layout */}
            <MapView />
        </div>
    );
}

export default Layout;