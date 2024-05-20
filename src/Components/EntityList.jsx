import React, { useEffect, useState } from "react";
import { fetchRecords, deleteRecord } from "../API/api";

export const EntityList = ({ entityName, attributes }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const recordsData = await fetchRecords(entityName);
        setRecords(recordsData);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    loadRecords();
  }, [entityName]);

  const handleDelete = async (id) => {
    try {
      await deleteRecord(entityName, id);
      setRecords(records.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <div>
      <h3>{entityName} Records</h3>
      <table>
        <thead>
          <tr>
            {attributes?.map((attr) => (
              <th key={attr.name}>{attr.name}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records?.map((record) => (
            <tr key={record.id}>
              {attributes.map((attr) => (
                <td key={attr.name}>{record[attr.name]}</td>
              ))}
              <td>
                <button onClick={() => handleDelete(record.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
