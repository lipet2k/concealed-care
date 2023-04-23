
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import UserTypeContext from '../contexts/UserTypeContext';
import React, { useContext } from 'react';
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
import Sidebar from "@/components/Sidebar";
import { FaUser, FaBuilding, FaStethoscope } from 'react-icons/fa';

let transactionFee = 0.1;


export default function Home() {
  const [someInfo, setSomeInfo] = useState('');

  let [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentNum: null as null | Field,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });


  useEffect(() => {
    (async () => {
      await isReady;

      const dummyReport = {
        patientIdHash: new Field(12345678),
        validUntil: new Field(20230430),
        bloodPressure: new Field(80),
        hasConditionA: new Bool(true),
        hasConditionB: new Bool(false),
        hasConditionC: new Bool(true),
      };


      if (!state.hasBeenSetup) {
        const zkappWorkerClient = new ZkappWorkerClient();

        console.log('Loading SnarkyJS...');
        await zkappWorkerClient.loadSnarkyJS();
        console.log('done');

        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }
        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);

        console.log('using key', publicKey.toBase58());

        console.log('checking if account exists...');
        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKey!,
        });
        const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();

        console.log('compiling zkApp');
        await zkappWorkerClient.compileContract();
        console.log('zkApp compiled');

        const zkappPublicKey = PublicKey.fromBase58(
          'B62qjXhUsobQLkQAjRxoPBpHN2bDAF27N8a6UhrdDCEyZWmY6C8v43Q'
        );

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);

        console.log('getting zkApp state...');
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        // const currentNum = await zkappWorkerClient.getNum();
        // console.log('current state:', currentNum.toString());

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


        console.log('sending a transaction...');

        await zkappWorkerClient!.fetchAccount({
          publicKey: publicKey!,
        });

        await zkappWorkerClient!.createPublishReportTransaction(dummyReport);

        console.log('creating proof...');
        await zkappWorkerClient!.proveTransaction();

        console.log('getting Transaction JSON...');
        const transactionJSON = await zkappWorkerClient!.getTransactionJSON();

        console.log('requesting send transaction...');
        const { hash } = await (window as any).mina.sendTransaction({
          transaction: transactionJSON,
          feePayer: {
            fee: transactionFee,
            memo: '',
          },
        });

        console.log(
          'See transaction at https://berkeley.minaexplorer.com/transaction/' + hash
        );

        setState({ ...state, creatingTransaction: false });
      }

      // const { ConcealedCare } = await import('../../../contracts/build/src/');

      // // Update this to use the address (public key) for your zkApp account
      // // To try it out, you can try this address for an example "Add" smart contract that we've deployed to
      // // Berkeley Testnet B62qisn669bZqsh8yMWkNyCA7RvjrL6gfdr3TQxymDHNhTc97xE5kNV
      // const zkAppAddress = 'B62qjXhUsobQLkQAjRxoPBpHN2bDAF27N8a6UhrdDCEyZWmY6C8v43Q';
      // // This should be removed once the zkAppAddress is updated.
      // if (!zkAppAddress) {
      //   console.error(
      //     'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
      //   );
      // }

      // const zkApp = new ConcealedCare(PublicKey.fromBase58(zkAppAddress));

      // let accounts;

      // let display = 'not loaded';

      // try {
      //   // Accounts is an array of string Mina addresses.
      //   accounts = await (window as any).mina.requestAccounts();

      //   // Show first 6 and last 4 characters of user's Mina account.
      //   display = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
      // } catch (err) {
      //   // If the user has a wallet installed but has not created an account, an
      //   // exception will be thrown. Consider showing "not connected" in your UI.
      //   console.log(err);
      // }



      // setSomeInfo(display);

      let reportFormInput = {
        patientId: "12345",
        validUntil: "2023-04-22",
        bloodPressure: "90",
        hasConditionA: true,
        hasConditionB: false,
        hasConditionC: true,
      }




    })();
  }, []);

  const { setUserRole } = useContext(UserTypeContext);
  const router = useRouter();

  //const { userType } = useContext(UserTypeContext);

  //useEffect(() => {
  //  console.log('User type changed:', userType);
  //}, [userType]);

  const handleUserRoleClick = (userType) => {
    setUserRole(userType);
  };

  return (
    <div>
      <Sidebar />
      <div className="generate-keys">
        <h1>Sign in as:</h1>
        <div>
          <button className="circular-button" onClick={() => handleUserRoleClick('user')}>
            <FaUser />
          </button>
          <button className="circular-button" onClick={() => handleUserRoleClick('company')}>
            <FaBuilding />
          </button>
          <button className="circular-button" onClick={() => handleUserRoleClick('doctor')}>
            <FaStethoscope />
          </button>
        </div>
      </div>
    </div>

  );
}
