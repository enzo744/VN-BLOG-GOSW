import React, { useRef, useState } from "react";
import CryptoJS from "crypto-js";

const SECRET_PASS = import.meta.env.VITE_SECRET_PASS;

const EncryptDecrypt = () => {
  // ============================== CRYPTO =====================
  const [errorMessage, setErrorMessage] = useState("");

  const [screen, setScreen] = useState("encrypt");
  const [text, setText] = useState("");

  // Store Encrypted data
  const [encryptedData, setEncryptedData] = useState("");

  // Store Decrypted data
  const [decryptedData, setDecryptedData] = useState("");

  const [copied, setCopied] = useState(false); // Stato per il pulsante copia

  const textAreaRef = useRef(null); // Ref per il focus

  // Switch between encrypt and decrypt screens
  const switchScreen = (type) => {
    textAreaRef.current.focus(); 
    setScreen(type);
    // Clear all data and error message when switching screens
    setText("");
    setEncryptedData("");
    setDecryptedData("");
    setErrorMessage("");
    setCopied(false);
  };

  // Encrypt user input text
  const encryptData = () => {
    try {
      const data = CryptoJS.AES.encrypt(
        JSON.stringify(text),
        SECRET_PASS
      ).toString();
      setEncryptedData(data);
      setErrorMessage("");
      setCopied(false);
      textAreaRef.current.focus(); // Porta il focus sull'area di testo
    } catch (error) {
      setErrorMessage("Encryption fallita. Controlla il tuo input!");
      console.log(error);
    }
  };

  // Decrypt user input text
  const decryptData = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(text, SECRET_PASS);
      const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDecryptedData(data);
      setErrorMessage("");
      textAreaRef.current.focus(); // Porta il focus sull'area di testo
    } catch (error) {
      setErrorMessage("Decryption fallita. Controlla il tuo input!");
      console.log(error);
    }
  };

  // Handle button click (Encrypt or Decript)
  const handleClick = () => {
    if (!text) {
      setErrorMessage("Inserire il testo per favore!");
      textAreaRef.current.focus(); // Sposta il focus quando c'è un errore
      return;
    }

    if (screen === "encrypt") {
      encryptData();
    } else {
      decryptData();
    }
  };

  const handleCopy = () => {
    const textToCopy = screen === "encrypt" ? encryptedData : decryptedData;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Nasconde il messaggio "Copied" dopo 2 secondi
  };

  return (
  <div className="p-4 max-w-3xl mx-auto min-h-screen">
    <form  className="flex flex-col gap-4 items-center">
      <div className="self-center">
      <h1 className="text-center text-2xl my-6 font-semibold italic text-slate-600">
        Encrypt & Decrypt
      </h1>
        <div>
          {/* Buttons to switch between Encrypt and Decrypt screens */}
          <span
            className={`btn btn-left ${
              screen === "encrypt" ? "active" : ""
            } cursor-pointer`}
            onClick={() => {
              switchScreen("encrypt");
            }}
          >
            Encrypt
          </span>
          <span
            className={`btn btn-right ${
              screen === "decrypt" ? "active" : ""
            } cursor-pointer`}
            onClick={() => {
              switchScreen("decrypt");
            }}
          >
            Decrypt
          </span>
        </div>

        <div className="card">
          {/* Textarea for user input  */}
          <textarea
            ref={textAreaRef} // Associa il ref alla textarea
            value={text}
            onChange={({ target }) => setText(target.value)}
            placeholder={
              screen === "encrypt"
                ? "Inserire testo da criptare... "
                : "Inserire testo da DEcriptare..."
            }
            className="border rounded w-full p-2"
          />

          {/* Display error message if there is an error */}
          {errorMessage && <div className="error">{errorMessage}</div>}

          {/* Encrypt or Decrypt button */}
          <span
            className={`btn submit-btn ${
              screen === "encrypt" ? "encrypt-btn" : "decrypt-btn"
            } cursor-pointer`}
            onClick={handleClick}
          >
            {screen === "encrypt" ? "Encrypt" : "Decript"}
          </span>
        </div>

        {/* Display Encrypted or Decrypted data if available */}
        {encryptedData || decryptedData ? (
          <div className="content">
            <label className="text-blue-600">
              {screen === "encrypt" ? "Encrypted" : "Decrypted"} DATA:
            </label>
            <p>{screen === "encrypt" ? encryptedData : decryptedData}</p>

            {/* Pulsante per copiare il testo */}
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        ) : null}
        {/* ----------Fine Encrypt and Decrypt --------------- */}
      </div>
    </form>
  </div>
  );
};

export default EncryptDecrypt;
