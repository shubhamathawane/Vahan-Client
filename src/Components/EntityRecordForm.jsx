import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  createRecord,
  deleteRecord,
  fetchEntityAttributes,
  fetchRecords,
  updateRecord,
} from "../API/api";
import { Formik, Form, Field } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircleXmark,
  faPenSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";

export const EntityRecordForm = () => {
  const [searchParams] = useSearchParams();
  const entity = searchParams.get("entity");
  const [attributes, setAttributes] = useState([]);
  const [data, setData] = useState([]);
  const [editedId, setEditedId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});

  console.log(entity, "entity...");

  const loadAttributes = async () => {
    try {
      const attrData = await fetchEntityAttributes(entity);
      setAttributes(attrData.data);
    } catch (error) {
      console.error("Error fetching entity attributes:", error);
    }
  };

  const getTableData = async () => {
    try {
      const res = await fetchRecords(entity);
      console.log(res.data, "data");
      setData(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteRecord(entity, id);
    if (res) {
      getTableData();
    }
    console.log(res);
  };

  useEffect(() => {
    loadAttributes();
    getTableData();
  }, [entity]);

  const initialValues = attributes.reduce((acc, attr) => {
    acc[attr.name] = "";
    return acc;
  }, {});

  const validationSchema = attributes.reduce((acc, attr) => {
    let schema;
    switch (attr.type) {
      case "STRING":
        schema = Yup.string().required("Required");
        break;
      case "NUMBER":
        schema = Yup.number().required("Required");
        break;
      case "DATE":
        schema = Yup.date().required("Required");
        break;
      default:
        schema = Yup.string().required("Required");
    }
    acc[attr.name] = schema;
    return acc;
  }, {});

  const handleEdit = (id) => {
    setEditedId(id);
    const row = data.find((item) => item.id === id);
    setEditedRowData(row);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveUpdate = async (id) => {
    console.log("id and data", id, editedRowData);
    await updateRecord(entity, id, editedRowData).then((res) => {
      if (res.status === 200) {
        alert("Record updated!");
        setEditedId(null);
        setEditedRowData([]);
        getTableData();
      }
    });
  };

  return (
    <div>
      <h2>Add Record to {entity}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object(validationSchema)}
        onSubmit={(values, { setSubmitting }) => {
          createRecord(entity, values)
            .then((response) => {
              alert("Record added!");
              getTableData();
              console.log("Record created:", response.data);
              setSubmitting(false);
            })
            .catch((error) => {
              console.error("Error creating record:", error);
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="row container">
              {attributes.map((attr) => (
                <div className="" key={attr.name}>
                  <label className="col-6 mb-2" htmlFor={attr.name}>
                    {attr.name}
                  </label>
                  <Field className="col-6 rounded px-2" name={attr.name} type="text" />
                </div>
              ))}
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Create Record
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <div className="">
        <hr />
        {data.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  {attributes.map((item) => (
                    <th key={item.name}>{item.name}</th>
                  ))}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {attributes.map((attr) => (
                      <td key={attr.name}>
                        {item.id === editedId ? (
                          <input
                            name={attr.name}
                            onChange={handleChange}
                            value={editedRowData[attr.name] || ""}
                            type="text"
                          />
                        ) : (
                          item[attr.name] || ""
                        )}
                      </td>
                    ))}
                    <td>
                      {editedId == item.id ? (
                        <div className="gap-2 d-flex">
                          <FontAwesomeIcon
                            onClick={() => handleSaveUpdate(item.id)}
                            className="text-primary bg-none"
                            icon={faCheck}
                          />
                          <FontAwesomeIcon
                            onClick={() => setEditedId(null)}
                            className="text-danger"
                            icon={faCircleXmark}
                          />{" "}
                        </div>
                      ) : (
                        <div className="gap-2 d-flex">
                          <FontAwesomeIcon
                            onClick={() => handleEdit(item.id)}
                            className="text-primary bg-none"
                            icon={faPenSquare}
                          />
                          <FontAwesomeIcon
                            onClick={() => handleDelete(item.id)}
                            className="text-danger"
                            icon={faTrash}
                          />{" "}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h3>No Records Found!</h3>
          </>
        )}
      </div>
    </div>
  );
};
