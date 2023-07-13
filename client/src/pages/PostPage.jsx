import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";

export default function PostPage() {
	const [postInfo, setPostInfo] = useState(null);
	const { id } = useParams();
	console.log(id);
	useEffect(() => {
		fetch(`http://localhost:4000/post/${id}`).then((response) => {
			response.json().then((postInfo) => {
				setPostInfo(postInfo);
			});
		});
	}, []);
	if (!postInfo) return "";

	return (
		<div className='post-page'>
			<h1>{postInfo.title}</h1>
			<time>
				{format(
					new Date(postInfo.createdAt),
					"d MMMMMMMMM, yyyy HH:mm"
				)}
			</time>
			<div className='author'>by @{postInfo.author.username}</div>
			<div className='image'>
				<img src={`http://localhost:4000/${postInfo.cover}`} alt='' />
			</div>

			{/* to return HTML/Markdown from a string */}
			<div>
				<div
					className='content'
					dangerouslySetInnerHTML={{ __html: postInfo.content }}
				/>
			</div>
		</div>
	);
}
