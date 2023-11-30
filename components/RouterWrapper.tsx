import * as React from "react";
import { NextRouter } from "next/router";
import { PRIVATE_ROUTE } from "../utils/auth";
import LoadingBar from "react-top-loading-bar";

type IProps = {
  router: NextRouter;
  children: JSX.Element;
};

export const RouterWrapper: React.FC<IProps> = (props) => {
  const [progress, setProgress] = React.useState(0);
  const [isValid, setIsValid] = React.useState(false);

  React.useLayoutEffect(() => {
    props.router.events.on("routeChangeStart", (url: string) => {
      const actUrl = url.split("?")[0];
      setProgress(20);
      if (PRIVATE_ROUTE.includes(actUrl)) {
        let storedUserDetail: any = localStorage.getItem("user");
        storedUserDetail = storedUserDetail ? JSON.parse(storedUserDetail) : {};
        if (!storedUserDetail?.userId || !storedUserDetail?.token) {
          window.location.href = "/";
        }
      }
    });
    props.router.events.on("routeChangeComplete", (url) => {
      setProgress(100);
    });
  }, [props.router.asPath]);

  React.useLayoutEffect(() => {
    if (PRIVATE_ROUTE.includes(props.router.route)) {
      let storedUserDetail: any = localStorage.getItem("user");
      storedUserDetail = storedUserDetail ? JSON.parse(storedUserDetail) : {};
      if (!storedUserDetail?.userId || !storedUserDetail?.token) {
        window.location.href = "/";
      } else {
        setIsValid(true);
      }
    } else {
      setIsValid(true);
    }
  }, []);

  return (
    <>
      <LoadingBar
        color="red"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        waitingTime={600}
      />
      {isValid && props.children}
    </>
  );
};
