"use client";

import { TouchEventHandler, useEffect, useRef, useState } from "react";
import { SheetComponentProps } from "./interface";

import classNames from "classnames";
import styles from "./styles/style.module.scss";
import { useSheet } from "./context";
import gsap from "gsap";
import { Button } from "../button";

export function Sheet (props: SheetComponentProps) {

	const sheet = useSheet();
	const sheetRef = useRef<HTMLDivElement>(null);

	const [ inactive, setInactive ] = useState<boolean>(!props.active);
	const [ isDragging, setIsDragging ] = useState<boolean>(false);
	const [ dragStart, setDragStart] = useState<number>(0);
	const [ dragMove, setDragMove] = useState<number>(0);

	const inactivate = () => {
		if (sheetRef.current) gsap.to(sheetRef.current, { y: `100svh`, scaleY: 1, duration: 0.3 });
		setTimeout(() => {
			setInactive(true);
		}, 600);
	};

	const handleTouchStart: TouchEventHandler<HTMLDivElement> = (event) => {
		event.stopPropagation();
		setIsDragging(true);
		setDragStart(event.touches[0].clientY);
	};

	const handleTouchMove: TouchEventHandler<HTMLDivElement> = (event) => {
		event.stopPropagation();
		if (isDragging) {
			const movement = event.touches[0].clientY - dragStart;
			if (movement > 0) {
				setDragMove(movement);
				if (sheetRef.current) gsap.to(sheetRef.current, { y: movement, scaleY: 1, duration: 0 });
			} else {
				const stretch = (Math.pow(Math.abs(movement/86000), 1/1.25)) + 1;
				if (sheetRef.current) gsap.to(sheetRef.current, { scaleY: stretch, duration: 0 });
			}
		}
	};

	const handleTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
		event.stopPropagation();
		if (dragMove >= 40) {
			if (sheetRef.current) gsap.to(sheetRef.current, { y: `100svh`, scaleY: 1, duration: 0.3 });
			sheet.close();
		} else {
			if (sheetRef.current) gsap.to(sheetRef.current, { y: 0, scaleY: 1, duration: 0.3 });
		}
		setIsDragging(false);
		setDragStart(0);
		setDragMove(0);
	};

	const contentTouchMoveHandler: TouchEventHandler<HTMLDivElement> = (event) => {
		const targetElement = event.currentTarget;
		if (targetElement.offsetHeight < targetElement.scrollHeight) {
			event.stopPropagation();
		}
	};

	useEffect(() => {
		if (props.active && inactive) {
			setInactive(false);
			if (sheetRef.current) gsap.fromTo(sheetRef.current, { y: `100svh` }, { y: 0, duration: 0.3 });
		}
		else if (!props.active && !inactive) {
			inactivate();
		}
	}, [props.active]);

	return (
		<div className={classNames(styles.SheetContainer, {
			[styles.Active]: props.active,
			[styles.Inactive]: inactive,
		})}>
			<div
				ref={sheetRef}
				className={styles.Sheet}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<div className={styles.Top}>
					<div className={styles.Notch}></div>
				</div>
				<div className={styles.Header}>
					<div className={styles.Title}>
						{props.title}
					</div>
					<div className={styles.Actions}>
						<Button icon="close" size="small" color="light" onClick={() => sheet.close()} />
					</div>
				</div>
				<div className={styles.Content} onTouchMove={contentTouchMoveHandler}>
					{props.children}
				</div>
			</div>
		</div>
	);

}