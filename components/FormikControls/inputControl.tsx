import { useFormikContext, useField } from "formik";
import React from "react";
import { Form } from "react-bootstrap";

const InputControl: React.FC<any> = (props) => {
  const { name, placeholder, formGrpClassName, label, as, ...rest } = props;
  const [field] = useField(name);
  const formikProps: any = useFormikContext();
  const { setFieldValue, setFieldTouched, errors, touched } = formikProps;

  const renderError = () => {
    return (
      errors &&
      touched &&
      errors[name] &&
      touched[name] && (
        <div className="mb-1" style={{ color: "red" }}>
          {errors[name]}
        </div>
      )
    );
  };

  return (
    <Form.Group
      className={`${formGrpClassName ? formGrpClassName : "InputMainComset"} ${
        renderError() ? " error" : ""
      }`}
      controlId=""
    >
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={as ? as : "text"}
        name={name}
        {...field}
        onChange={(e) => {
          setFieldTouched(name, true);
          setFieldValue(name, e.target.value);
        }}
        placeholder={placeholder}
        {...rest}
        autoComplete="off"
      />
      {renderError()}
    </Form.Group>
  );
};

export default InputControl;
