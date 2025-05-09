import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
	const [messages, setMessages] = useState(["hello from server"]);
	const wsRef = useRef<HTMLInputElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8081");

		ws.onmessage = (event) => {
			setMessages((m) => [...m, event.data]);
		};
		//@ts-ignore
		wsRef.current = ws;

		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					type: "join",
					payload: {
						roomId: "red",
					},
				})
			);
		};
		return () => {
			ws.close();
		};
	}, []);
	return (
		<div className="h-screen bg-black w-full">
			<br /> <br /> <br />
			<div className="h-[85%] overflow-y-auto">
				{messages.map((message) => (
					<div className="m-8">
						<span className="bg-white text-black rounded p-4"> {message}</span>
					</div>
				))}
			</div>
			<div className="w-full bg-white flex">
				<input ref={inputRef} id="message" className="flex-1 p-4" />
				<button
					onClick={() => {
						//@ts-ignore
						const message = inputRef.current?.value;
						//@ts-ignore
						wsRef.current.send(
							JSON.stringify({
								type: "chat",
								payload: {
									message: message,
								},
							})
						);
					}}
					className="bg-purple-600 text-white p-4"
				>
					Send Message
				</button>
			</div>
		</div>
	);
}

export default App;
