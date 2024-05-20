import logo from "./logo.svg";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import { EntityForm } from "./Components/EntityForm";
import { EntityRecordForm } from "./Components/EntityRecordForm";
import { useState } from "react";
import { EntityList } from "./Components/EntityList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./Components/Navbar";

function App() {
  const [entities, setEntities] = useState([]);

  const addEntity = (entity) => {
    setEntities([...entities, entity]);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<EntityForm addEntity={addEntity} />} />
        <Route path="/list" element={<EntityList />} />
        <Route path="/record-form" element={<EntityRecordForm />} />
      </Routes>
      {/* 
      {entities.map((entity, index) => (
        <div key={index}>
          <h2>{entity.name}</h2>
          <EntityRecordForm
            entityName={entity.name}
            attributes={entity.attributes}
          />
          <EntityList entityName={entity.name} attributes={entity.attributes} />
        </div>
      ))} */}
    </Router>
  );
}

export default App;
