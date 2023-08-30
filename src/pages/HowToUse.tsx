import React, { useEffect, useState } from "react";
import axios from "axios";
import apiRoutes from "../components/Routes";

const HowToUse = () => {
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    axios
      .get(apiRoutes.howtouse)
      .then((response: any) => {
        setData(response.data.users);

        console.log(response.data.users);
        //updateStates(response.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  {
    /*} const updateStates = (receivedData: any) => {
    receivedData.map((item: any, index: number) => {
      let firstChar = item.sectionname.charAt(0);
      //console.log(item.sectionname.charAt(0));
      if (firstChar === "p" || firstChar === "P") {
        setPdf((prev: any) => [...prev, item]);
      }
      if (firstChar === "i" || firstChar === "I") {
        setImages((prev: any) => [...prev, item]);
      }
      if (firstChar === "v" || firstChar === "V") {
        setVideos((prev: any) => [...prev, item]);
      }
    });
  };*/
  }
  return (
    <div>
      <ul>
        {data.length !== 0 ? (
          data.map((item: any, index: number) => (
            <li key={index}>
              <h4 style={{ marginLeft: "18px" }}>
                <a
                  href={"https://docuclip.app/ci4-dms-updated/" + item.filepath}
                  style={{ textDecoration: "none" }}
                >
                  {item.sectionname}
                </a>
              </h4>
            </li>
          ))
        ) : (
          <li>
            <h4 style={{ marginLeft: "20px" }}>Coming Soon...</h4>
          </li>
        )}
      </ul>
    </div>
  );
};

export default HowToUse;
