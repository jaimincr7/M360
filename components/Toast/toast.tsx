import Toast from "react-bootstrap/Toast";

function Toasters(props) {
  return (
    <Toast>
      {props?.header ? (
        <Toast.Header>
          <strong className="me-auto">{props?.header}</strong>
        </Toast.Header>
      ) : (
        <></>
      )}
      <Toast.Body>{props?.message}.</Toast.Body>
    </Toast>
  );
}

export default Toasters;
