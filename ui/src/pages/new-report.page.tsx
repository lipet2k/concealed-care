import Sidebar from "@/components/Sidebar";
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Mina,
  isReady,
  PublicKey,
  fetchAccount,
  Field,
  Bool,
} from 'snarkyjs';
import ZkappWorkerClient from './zkappWorkerClient';
import { Report, Requirements } from '../../../contracts/src/ConcealedCare';
import { buildReportFromFormInput } from "@/util";

let transactionFee = 0.1;


export default function NewReport() {
  let [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentNum: null as null | Field,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
    hash: ""
  });

  let [form1output, setForm1output] = useState("")

  async function publishReport(report: Report) {
    doShowOverlay()

    myLog('sending transaction...');

    await state.zkappWorkerClient!.fetchAccount({
      publicKey: state.publicKey!,
    });

    await state.zkappWorkerClient!.createPublishReportTransaction(report);

    myLog('creating proof...');
    await state.zkappWorkerClient!.proveTransaction();

    myLog('getting Transaction JSON...');
    const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

    myLog('requesting send transaction...');
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: '',
      },
    });

    myLog(
      'See transaction at https://berkeley.minaexplorer.com/transaction/' + hash
    );
    doHideOverlay()


    setState({ ...state, creatingTransaction: false, hash: hash });
    setForm1output(JSON.stringify(report, null, 2))
  }

  useEffect(() => {
    (async () => {
      await isReady;
      doShowOverlay()

      if (!state.hasBeenSetup) {
        const zkappWorkerClient = new ZkappWorkerClient();

        myLog('Loading SnarkyJS...');
        await zkappWorkerClient.loadSnarkyJS();
        myLog('done');

        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }
        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);

        myLog('using key', publicKey.toBase58());

        myLog('checking if account exists...');
        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKey!,
        });
        const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();

        myLog('compiling zkApp');
        await zkappWorkerClient.compileContract();
        myLog('zkApp compiled');

        const zkappPublicKey = PublicKey.fromBase58(
          'B62qjXhUsobQLkQAjRxoPBpHN2bDAF27N8a6UhrdDCEyZWmY6C8v43Q'
        );

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);

        myLog('getting zkApp state...');
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        myLog('READY!')
        doHideOverlay()
        // const currentNum = await zkappWorkerClient.getNum();
        // myLog('current state:', currentNum.toString());

        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists,
          // currentNum,
        });

      }


    })();
  }, []);



  const [patientID, setPatientID] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [condition_1, setCondition_1] = useState("");
  const [condition_2, setCondition_2] = useState("");
  const [condition_3, setCondition_3] = useState("");

  const [showOverlay, setShowOverlay] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  function doShowOverlay() {
    setLogs([])
    setShowOverlay(true)
  }

  function doHideOverlay() {
    setShowOverlay(false)
  }

  const myLog = (...message: any) => {
    console.log(...message)
    setLogs((prevLogs) => [...(prevLogs || []), message]);
  };


  return (
    <div className="App bg-white-50 dark:bg-zinc-900">
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h1>Processing...</h1>
            <ul ><code className="mt-5">
              {logs.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </code></ul>
          </div>
        </div>
      )}
      <Sidebar />
      <div className="generate-keys">
        <h1>New Report</h1>

        <form
          className="main-form"
          onSubmit={(e: any) => {
            publishReport(buildReportFromFormInput({
              patientId: patientID,
              validUntil,
              bloodPressure,
              hasConditionA: condition_1,
              hasConditionB: condition_2,
              hasConditionC: condition_3,
            }));


            e.preventDefault();
          }}
        >
          {/* <h2>Christian Adelmund</h2>
          <p className="secondary">hdI4yZ5ew18JH4JW9jbhUFrviQzM7</p> */}
          {/*
          <div className="top-right">
            <button className="secondary">Import</button>
          </div> */}

          <div className="patient-id mt-5">
            <h3>Patient ID</h3>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="condition-1"
              type="text"
              placeholder="123"
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
              placeholder="YYYY-MM-DD"
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
          <div className='mt-16'>
            <button
              className="button-main right hover:bg-blue-800 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Generate medical report
            </button>
          </div>
        </form>
        {form1output && (<>
          <h1>Medical report to generate proof</h1>
          <a className="my-5" href={'https://berkeley.minaexplorer.com/transaction/' + state.hash}><code>{state.hash}</code></a>
          <pre className="bg-gray-100 text-gray-800 p-4 rounded-md overflow-auto shadow-md">
            <code>{form1output}</code>
          </pre>
        </>)}
      </div>
    </div>
  );

};
