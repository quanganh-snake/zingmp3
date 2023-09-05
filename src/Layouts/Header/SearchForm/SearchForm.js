import React, { useState, useRef } from "react";
import IonIcon from "@reacticons/ionicons";
import { DebounceInput } from "react-debounce-input";
import SearchSuggest from "./SearchSuggest";

import useClient from "./../../../Services/Hooks/useClient";

export default function SearchForm() {
	const [isHide, setHide] = useState(true);
	const [songs, setSongs] = useState([]);
	const [suggests, setSuggests] = useState([]);
	const inputRef = useRef();
	const client = useClient();

	const getSongs = async (keywords) => {
		if (keywords !== "") {
			const songs = await client.get("/songs", { q: keywords });
			setSongs(songs);
		} else {
			setSongs([]);
		}
	};

	const getSuggests = async (keywords) => {
		if (keywords !== "") {
			const suggests = await client.get("/keywords", { q: keywords });
			setSuggests(suggests);
		} else {
			setSuggests([]);
		}
	};

	const handleFocusSearch = (status) => {
		const time = !status ? 0 : 500;
		setTimeout(() => {
			setHide(status);
		}, time);
	};

	const handleSearch = (e) => {
		const keywords = e.target.value;
		getSongs(keywords);
		getSuggests(keywords);
	};

	const postKeywords = async (keywords) => {
		await client.post(client.keywords, {
			keyword: keywords,
		});
	};

	const handlePostKeywords = () => {
		const keywords = inputRef.current.value;
		if (keywords !== "") {
			postKeywords(keywords);
		}
	};

	return (
		<div className="zing-search">
			<div className="search-icon color-main">
				<IonIcon name="search-outline" role="img" className="md hydrated" aria-label="search outline" />
			</div>
			<input
				type="text"
				ref={inputRef}
				onFocus={() => {
					handleFocusSearch(false);
				}}
				onBlur={() => {
					handleFocusSearch(true);
				}}
				onKeyUp={handleSearch}
				className="color-main"
				placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát..."
			/>
			{/* ------------------------- */}
			<SearchSuggest isHide={isHide} songs={songs} suggests={suggests} onPostKeywords={handlePostKeywords} />
		</div>
	);
}
