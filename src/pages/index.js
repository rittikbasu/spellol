import { useState, useEffect } from "react";
import Head from "next/head";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { createClient } from "@supabase/supabase-js";
import clsx from "clsx";

import { IoMdCloseCircle } from "react-icons/io";
import { FaPlay, FaCheck, FaPause } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

import Header from "@/components/Header";

function Home({ words }) {
  console.log("Words", words);
  let keyboard;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [word, setWord] = useState(words[currentWordIndex].word);
  const [input, setInput] = useState("");
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const keyboardOnChange = (input) => {
    setInput(input);
  };

  const onKeyPress = (button) => {
    console.log("Button pressed", button);
    if (button === "{bksp}") {
      setInput((prev) => prev.slice(0, -1));
    }
  };

  const playAudio = () => {
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSubmit = () => {
    if (input === "") return;
    if (input.toLowerCase() === word.toLowerCase()) {
      console.log("Success on submit");
      setFeedback("correct");

      if (currentWordIndex < words.length - 1) {
        const nextWordIndex = currentWordIndex + 1;
        const nextWord = words[nextWordIndex];
        setInput("");
        setCurrentWordIndex(nextWordIndex);
        setWord(nextWord.word);

        const audioInstance = new Audio(nextWord.audio);
        audioInstance.addEventListener("ended", () => setIsPlaying(false));
        setAudio(audioInstance);

        setTimeout(() => {
          audioInstance.play();
          setIsPlaying(true);
        }, 700);
      }
    } else {
      console.log("Input does not match the word");
      setFeedback("incorrect");
    }
    setTimeout(() => setFeedback(null), 2000);
  };
  useEffect(() => {
    const audioInstance = new Audio(words[currentWordIndex].audio);
    setAudio(audioInstance);

    const handleAudioEnd = () => setIsPlaying(false);
    audioInstance.addEventListener("ended", handleAudioEnd);

    return () => {
      audioInstance.removeEventListener("ended", handleAudioEnd);
    };
  }, [currentWordIndex, words]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      let key = e.key;
      console.log("Key pressed", key);
      if (key === "Enter") {
        e.preventDefault();
        console.log("Enter pressed");
        handleSubmit();
      } else if (key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(key)) {
        setInput((prev) => {
          if (prev.length >= 45) return prev;
          return prev + key.toLowerCase();
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [input, word]);
  return (
    <>
      <Head>
        <title>spella - daily challenge</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className="max-w-xl md:py-8 px-2 py-4 h-dvh w-dvw flex flex-col justify-between mx-auto">
        <Header />

        <div className="flex items-center justify-center">
          <button
            className="bg-gradient-to-bl from-yellow-400 to-amber-500 group shadow-lg outline-none text-white font-bold p-8 rounded-full"
            onClick={playAudio}
          >
            {isPlaying ? (
              <FaPause className="text-4xl text-black/70 group-hover:text-white" />
            ) : (
              <FaPlay className="text-4xl text-black/70 group-hover:text-white" />
            )}
          </button>
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <div className="border-2 border-amber-400 min-w-72 shadow-lg text-center rounded-xl mb-4 p-2 backdrop-blur-sm bg-gray-200/30 break-all">
            {input === "" ? (
              <span className="text-2xl tracking-wider text-zinc-400">
                let&rsquo;s get typing
              </span>
            ) : (
              <span className="text-2xl tracking-widest">{input}</span>
            )}
          </div>
        </div>

        <div className="w-full px-1 flex flex-col">
          <div className="rounded-xl overflow-hidden py-2 md:px-2 h-[156px]  old-keyboard-style">
            <Keyboard
              key={currentWordIndex}
              keyboardRef={(r) => (keyboard = r)}
              onChange={(newInput) => keyboardOnChange(newInput)}
              onKeyPress={(button) => onKeyPress(button)}
              maxLength={45}
              theme={"hg-theme-default hg-layout-default my-theme"}
              layout={{
                default: [
                  "q w e r t y u i o p",
                  "a s d f g h j k l",
                  "z x c v b n m {bksp}",
                ],
              }}
              buttonTheme={[
                {
                  class: "hg-red hg-bigger-backspace",
                  buttons: "{bksp}",
                },
              ]}
              display={{
                "{bksp}": "delete",
              }}
              physicalKeyboardHighlight={input.length < 45}
              physicalKeyboardHighlightTextColor="#f59e0b"
              physicalKeyboardHighlightBgColor="#d1d5db"
            />
          </div>
          <button
            onClick={handleSubmit}
            className={clsx(
              "order-last md:order-first items-center transition-shadow duration-300 mx-auto outline-none shadow-lg text-white text-xl px-8 md:my-8 rounded-xl mt-4",
              feedback === "correct"
                ? "bg-gradient-to-bl shadow-lime-200 from-lime-400 to-lime-500"
                : feedback === "incorrect"
                ? "border-red-300 shadow-red-100 border bg-gradient-to-bl from-gray-100 via-gray-200 to-gray-300"
                : "bg-gradient-to-bl from-yellow-400 to-amber-500 "
            )}
          >
            {feedback === "correct" ? (
              <div className="flex items-center py-2">
                correct <FaCheck className="ml-2" />
              </div>
            ) : feedback === "incorrect" ? (
              <div className="flex items-center text-gray-900 py-[0.44rem]">
                <IoMdCloseCircle className="mr-2 h-6 w-6 text-red-400" />
                try{" "}
                <span className="ml-1 underline decoration-wavy underline-offset-[5px] decoration-red-500">
                  agen
                </span>
              </div>
            ) : (
              <div className="flex items-center py-2">
                submit <FaArrowRightLong className="ml-2" />
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
  const { data, error } = await supabase
    .from("bee_dictionary")
    .select("word, audio")
    .neq("audio", null)
    .order("definition", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching words from Supabase", error);
    return { props: { words: [] } };
  }

  return {
    props: {
      words: data,
    },
    revalidate: 1,
  };
}

export default Home;
