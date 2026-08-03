const QuestionDetails = async ({ params }: RouteParams) => {
	const { id } = await params;

	return <div>Question Content</div>;
};

export default QuestionDetails;
