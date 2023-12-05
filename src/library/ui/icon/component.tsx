import classNames from "classnames";
import styles from "./style.module.scss";

interface Props {
	name: string;
	className?: string;
}

export function Icon ({
	name,
	className,
}: Props) {
	return (
		<span className={classNames(
			styles.Icon,
			className,
		)}>{name}</span>
	)
}