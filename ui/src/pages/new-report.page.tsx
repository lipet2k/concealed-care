import Sidebar from "@/components/Sidebar";
import InputNumber from 'rc-input-number';
import { useState } from 'react';

function encrypt_and_publish() {

}

export default function NewReport() {
  const [patientID, setPatientID] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [condition_1, setCondition_1] = useState("");
  const [condition_2, setCondition_2] = useState("");
  const [condition_3, setCondition_3] = useState("");
  return (
    <div className="App bg-white-50 dark:bg-zinc-900">
      <Sidebar />
      <div className="generate-keys">
        <h1>New Report</h1>

        <form
          className="main-form"
          onSubmit={(e: any) => {
            console.log({ patientID });
            console.log({ validUntil });
            console.log({ bloodPressure });
            console.log({ condition_1 });
            console.log({ condition_2 });
            console.log({ condition_3 });
            e.preventDefault();
          }}
        >
          <h2>Ruby Adelmund</h2>

          <p className="secondary">hdI4yZ5ew18JH4JW9jbhUFrviQzM7</p>

          <div className="top-right">
            <button className="secondary">Import</button>
          </div>

          <div className="patient-id mt-5">
            <h3>Patient ID</h3>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="condition-1"
              type="text"
              placeholder="lmf1987sdfkl3u8f7s1203cja..."
              onChange={(e) => {
                setPatientID(e.target.value);
              }}
            ></input>
          </div>

          <div className="datetime mt-5">
            <h3>Valid Until</h3>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="condition-1"
              type="text"
              placeholder="DD/MM/YYY"
              onChange={(e) => {
                setValidUntil(e.target.value);
              }}
            ></input>
          </div>

          <div className="blood-pressure mt-5">
            <h3>Blood Pressure</h3>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="condition-1"
              type="text"
              placeholder="90"
              onChange={(e) => {
                setBloodPressure(e.target.value);
              }}
            ></input>
          </div>

          <div className="coditions mt-5">
            <h3>Condition #1</h3>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="condition-1"
              type="text"
              placeholder="True"
              onChange={(e) => {
                setCondition_1(e.target.value);
              }}
            ></input>
          </div>

          <div className="coditions mt-5">
            <h3>Condition #2</h3>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="condition-1"
              type="text"
              placeholder="True"
              onChange={(e) => {
                setCondition_2(e.target.value);
              }}
            ></input>
          </div>

          <div className="coditions mt-5">
            <h3>Condition #3</h3>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="condition-1"
              type="text"
              placeholder="True"
              onChange={(e) => {
                setCondition_3(e.target.value);
              }}
            ></input>
          </div>

          <div className="half-width inner-form-container">
            <h3>Condition</h3>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="condition-1"
              type="text"
              placeholder="True"
              onChange={(e) => {
                setCondition_3(e.target.value);
              }}
            ></input>

            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="condition-2"
              type="text"
              placeholder="New Condition"
            ></input>

            <a href="#">+ Add Condition</a>
          </div>

          <div className="half-width inner-form-container second-col">
            <h3>Accommodations</h3>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="condition-1"
              type="text"
              value="Reserved Parking"
            ></input>

            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="condition-2"
              type="text"
              placeholder="New Accommodation"
            ></input>

            <a href="#">+ Add Accommodation</a>
          </div>

          <button
            className="button-main right hover:bg-blue-800 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
            // onClick={() => encrypt_and_publish()}
          >
            Encrypt and Publish
          </button>
        </form>
      </div>
    </div>
  );
};
