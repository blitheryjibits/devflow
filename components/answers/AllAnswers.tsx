import { EMPTY_ANSWERS } from "@/constants/states";
import DataRenderer from "../DataRenderer";

interface Props extends ActionResponse<Answer[]> {
	totalAnswers: number;
}

const AllAnswers = ({ data, success, error, totalAnswers }: Props) => {
	return (
		<div className="mt-11">
			<div className="flex items-center justify-between">
				<h3 className="primary-text-gradient">
					{totalAnswers > 1
						? `${totalAnswers} answers`
						: `${totalAnswers} answer`}
				</h3>
				<p>Filters</p>
			</div>
			<DataRenderer
				data={data}
				error={error}
				success={success}
				empty={EMPTY_ANSWERS}
				render={(answers) => {
					answers.map((answer) => <AnswerCard key={answer._id} {...answer} />);
				}}
			/>
		</div>
	);
};

export default AllAnswers;
