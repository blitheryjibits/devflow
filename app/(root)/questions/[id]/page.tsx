const QuestionDetails = async ({ params }: RouteParams) => {
	const { id } = await params;

	return <div>Question Content: {id}</div>;
};

export default QuestionDetails;
