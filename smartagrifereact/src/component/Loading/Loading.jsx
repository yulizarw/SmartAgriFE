// import React from "react";
// import Lottie from "react-lottie";
// import * as loaderData from "../../asset/lottieLego.json";

// import "../../screen/css/loading.css";


// const Loading = ({ show = false, size = 180 }) => {
//   if (!show) {
//     return null;
//   }

//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: loaderData,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//     },
//   };

//   return (
//     <div className="loading-overlay">
//       <Lottie options={defaultOptions} height={size} width={size} />
//     </div>
//   );
// };

// export default Loading;
// import React from "react";
// import Lottie from "react-lottie";
// import * as loaderData from "../../asset/lottieLego.json";

// import "../Loading/Loading.css"

// const Loading = ({ show = false, size = 180, text = "Loading..." }) => {
//   if (!show) {
//     return null;
//   }

//   const options = {
//     loop: true,
//     autoplay: true,
//     animationData: loaderData,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//     },
//   };

//   return (
//     <div className="loading-overlay">
//       <div className="loading-content">
//         <Lottie options={options} height={size} width={size} />

//         {text && <p className="loading-text">{text}</p>}
//       </div>
//     </div>
//   );
// };

// export default Loading;

import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";

import * as loaderData from "../../asset/lottieLego.json";

import "../Loading/Loading.css";

const Loading = ({ duration = 1500 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  if (!show) {
    return null;
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="loading-overlay">
      <Lottie options={defaultOptions} height={180} width={180} />
    </div>
  );
};

export default Loading;