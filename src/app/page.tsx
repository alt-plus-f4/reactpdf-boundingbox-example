'use client';

import { useState, useCallback } from 'react';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString();

// helper to generate a random RGB color
// highlight helper with random low-opacity background
function highlightPattern(text: string, pattern: string) {
	if (!pattern) return text;
	const regex = new RegExp(pattern, 'gi');
	return text.replace(regex, (value) => {
		const useBackground = Math.random() < 0.5; // 50/50 choice

		if (useBackground) {
			const bgColor = 'rgba(255, 0, 100, 0.3)';
			return `<span style="
        background-color: ${bgColor};
        border-radius: 2px;
		margin: 0 -1px;
      ">${value}</span>`;
		} else {
			const borderColor = 'rgb(255, 0, 100)';
			return `<span style="
        border: 1px solid ${borderColor};
        border-radius: 2px;
        line-height: 1;
		margin: 0 -1px;
        box-sizing: border-box;
        display: inline;
      ">${value}</span>`;
		}
	});
}

export default function Home() {
	const [numPages, setNumPages] = useState<number>();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [pageNumber, setPageNumber] = useState<number>(1);
	// new state for search
	const [searchText, setSearchText] = useState<string>('');

	function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
		setNumPages(numPages);
	}

	// renderer that wraps matching text in <mark>
	const textRenderer = useCallback(
		(textItem: { str: string }) =>
			highlightPattern(textItem.str, searchText),
		[searchText]
	);

	return (
		<div>
			<div>
				<label htmlFor='search'>Search:</label>
				<input
					id='search'
					type='search'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</div>

			<Document file='sample.pdf' onLoadSuccess={onDocumentLoadSuccess}>
				{/* pass customTextRenderer to highlight matches */}
				<Page
					pageNumber={pageNumber}
					customTextRenderer={textRenderer}
				/>
			</Document>

			{/* search input */}

			<p>
				Page {pageNumber} of {numPages}
			</p>
		</div>
	);
}
