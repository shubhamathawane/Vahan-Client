import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { createEntity, getEntity } from "../API/api";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const EntityForm = () => {
  const [entityList, setEntityList] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState("");

  const getEntityList = async () => {
    const res = await getEntity();
    if (res.status == 200) {
      console.log(res.data, "data....");
      setEntityList(res.data);
    }
  };

  useEffect(() => {
    getEntityList();
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    setSelectedEntity(e.target.value);
  };

  return (
    <div className="container">
      <Formik
        initialValues={{ name: "", attributes: [] }}
        validationSchema={Yup.object({
          name: Yup.string().required("Required"),
          attributes: Yup.array().of(
            Yup.object({
              name: Yup.string().required("Required"),
              type: Yup.string()
                .oneOf(["STRING", "NUMBER", "DATE"])
                .required("Required"),
            })
          ),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          createEntity(values)
            .then((response) => {
              getEntityList();
              console.log("Entity created:", response);
              if (response.status == 201) {
                alert("Entity Created Successfully!");
              }
              setSubmitting(false);
              resetForm();
            })
            .catch((error) => {
              console.error("Error creating entity:", error);
              alert(error.message);
              setSubmitting(false);
            });
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <label className="" htmlFor="name">
              Entity Name
            </label>
            <Field
              placeholder="Enter Entity Name"
              className="mx-2"
              name="name"
              type="text"
            />
            <FieldArray name="attributes">
              {({ push, remove }) => (
                <div className="">
                  {values.attributes.map((attribute, index) => (
                    <div className="d-flex gap-2 mt-2" key={index}>
                      <Field
                        name={`attributes[${index}].name`}
                        type="text"
                        placeholder="Attribute Name"
                      />
                      <Field name={`attributes[${index}].type`} as="select">
                        <option value="">Select Type</option>
                        <option value="STRING">String</option>
                        <option value="NUMBER">Number</option>
                        <option value="DATE">Date</option>
                      </Field>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn border mt-2 mb-2"
                    onClick={() => push({ name: "", type: "STRING" })}
                  >
                    Add Attribute <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              )}
            </FieldArray>
            <button
              className="btn btn-success"
              type="submit"
              disabled={isSubmitting}
            >
              Create Entity
            </button>
          </Form>
        )}
      </Formik>
      <div className="d-flex mt-3">
        <select onChange={handleChange} name="" id="">
          <option value={""}> -- Select Entity --</option>
          {entityList?.map((item, key) => (
            <option key={key} value={item}>
              {item}
            </option>
          ))}
        </select>
        <Link
          className="btn btn-success mx-2 h-50"
          to={`/record-form?entity=${selectedEntity}`}
        >
          Go.
        </Link>
      </div>
    </div>
  );
};
