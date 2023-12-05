"use client";

import { ReactNode, TouchEventHandler, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Icon } from "@/library/ui/icon";
import { useDateSelector } from "../context";
import { DateView } from "../views/date-view";

import styles from "../styles/style.module.scss";
import { throttle } from "lodash";
import { DateTimeUtils } from "../../utils";

const WIDTH = 22 * 16;

export function DateViews () {

	const context = useDateSelector();
	const containerRef = useRef<HTMLDivElement>(null);
	const ref = useRef<HTMLDivElement>(null);

	const weekdays = useMemo(() => DateTimeUtils.getWeekdays(), []);

	// Date views
	const [ dateViews, setDateViews ] = useState<{
		offsetMonth: number,
		component: ReactNode;
	}[]>([
		{ offsetMonth: -1, component: <DateView offsetMonth={-1} /> },
		{ offsetMonth: 0, component: <DateView offsetMonth={0} /> },
		{ offsetMonth: 1, component: <DateView offsetMonth={1} /> },
	]);
	const [ activeOffset, setActiveOffset ] = useState<number>(0);

	// Drag movement
	const [ isDragging, setIsDragging ] = useState<boolean>(false);
	const [ dragStart, setDragStart] = useState<number>(0);
	const [ dragMove, setDragMove] = useState<number>(0);
	const [ transitioning, setTransitioning ] = useState<boolean>(false);

	const handleTouchStart: TouchEventHandler<HTMLDivElement> = (event) => {
		event.stopPropagation();
		if (!isDragging && !transitioning) {
			setIsDragging(true);
			setDragStart(event.touches[0].clientX);
			setTransitioning(true);
		}
	};

	const handleTouchMove: TouchEventHandler<HTMLDivElement> = (event) => {
		event.stopPropagation();
		if (isDragging) {
			const movement = event.touches[0].clientX - dragStart;
			setDragMove(movement);
			if (ref.current) {
				if ((Math.abs(movement) <= WIDTH)) gsap.to(ref.current, { x: movement, duration: 0 });
				else gsap.to(ref.current, { x: (WIDTH * Math.sign(movement)) + (Math.sqrt(Math.abs(Math.abs(movement) - WIDTH)) * Math.sign(movement)), duration: 0 });
			}
		}
	};
	const throttledTouchMove = throttle(handleTouchMove, 50);

	const handleTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
		event.stopPropagation();
		setIsDragging(false);
		if (dragMove >= 40 && !backDisabled) {
			goToPreviousMonth();
		}
		else if (dragMove <= -40 && !forwardDisabled) {
			goToNextMonth();
		} else {
			afterNavigationHandler(activeOffset);
		}
		if (ref.current) gsap.to(ref.current, { x: 0, duration: 0.3 });
		setDragStart(0);
		setDragMove(0);
	};

	// Navigation

	const canNavigateBack = (): boolean => {
		if (!context.min) return true;
		const targetOffset = activeOffset - 1;
		let lastDayOfTarget = context.displayDate.plus({ months: targetOffset });
		lastDayOfTarget = lastDayOfTarget.endOf("month");
		return lastDayOfTarget.toMillis() >= context.min.toMillis();
	};
	const backDisabled: boolean = useMemo(() => !canNavigateBack(), [context.min, activeOffset]);
	
	const canNavigateForward = (): boolean => {
		if (!context.max) return true;
		const targetOffset = activeOffset - 1;
		let firstDayOfTarget = context.displayDate.plus({ months: targetOffset });
		firstDayOfTarget = firstDayOfTarget.startOf("month");
		return firstDayOfTarget.toMillis() <= context.max.toMillis();
	};
	const forwardDisabled: boolean = useMemo(() => !canNavigateForward(), [context.max, activeOffset]);

	const goToNextMonth = () => {
		if (forwardDisabled) return;
		setTransitioning(true);
		const target = activeOffset + 1;
		if (ref.current) {
			const current = ref.current.querySelector(`[data-offset="${String(activeOffset)}"]`);
			const next = ref.current.querySelector(`[data-offset="${String(activeOffset + 1)}"]`);
			gsap.to(current, { x: (WIDTH * 1 * -1), duration: 0.3 });
			gsap.to(next, { x: (WIDTH * 0 * -1), duration: 0.3 });
		}
		setTimeout(() => {
			afterNavigationHandler(target);
		}, 300);
	};
	const goToPreviousMonth = () => {
		if (backDisabled) return;
		setTransitioning(true);
		const target = activeOffset - 1;
		if (ref.current) {
			const current = ref.current.querySelector(`[data-offset="${String(activeOffset)}"]`);
			const prev = ref.current.querySelector(`[data-offset="${String(activeOffset - 1)}"]`);
			gsap.to(current, { x: (WIDTH * 1), duration: 0.3 });
			gsap.to(prev, { x: (WIDTH * 0), duration: 0.3 });
		}
		setTimeout(() => {
			afterNavigationHandler(target);
		}, 300);
	};
	const afterNavigationHandler = (targetOffset: number) => {
		const isTargetNext = targetOffset > activeOffset;
		if (ref.current && containerRef.current) {
			const target = ref.current.querySelector(`[data-offset="${String(targetOffset)}"]`);
			if (target) {
				const rect = target.querySelector(".date-view")?.getBoundingClientRect();
				if (rect) {
					gsap.to(containerRef.current, { height: rect.height, duration: 0.3 });
				}
			}
		}
		if (isTargetNext) {
			if (!dateViews.find(view => view.offsetMonth === targetOffset + 1)) {
				setDateViews([
					...dateViews.slice(1),
					{ offsetMonth: targetOffset + 1, component: <DateView offsetMonth={targetOffset + 1} /> }
				]);
			}
		} else {
			if (!dateViews.find(view => view.offsetMonth === targetOffset - 1)) {
				setDateViews([
					{ offsetMonth: targetOffset - 1, component: <DateView offsetMonth={targetOffset - 1} /> },
					...dateViews.slice(0, -1),
				]);
			}
		}
		setActiveOffset(targetOffset);
		setTransitioning(false);
	};

	useEffect(() => {
		afterNavigationHandler(activeOffset);
	}, []);

	return (
		<div
			ref={containerRef}
			className={styles.DateViews}
			onTouchStart={handleTouchStart}
			onTouchMove={throttledTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			<div className={styles.Weekdays}>
				{weekdays.map(day => (
					<div
						key={day}
						className={styles.Cell}>
						{day}
					</div>
				))}
			</div>
			<div ref={ref} className={styles.DateViewList}>
				{dateViews.map(view => (
					<div key={view.offsetMonth} className={styles.DateViewContainer} data-offset={String(view.offsetMonth)} style={{
						transform: `translateX(${WIDTH * (view.offsetMonth - activeOffset)}px)`,
					}}>
						{view.component}
					</div>
				))}
			</div>
			<div className={styles.Navigation}>
				<button onClick={() => goToPreviousMonth()} disabled={backDisabled || transitioning}>
					<Icon className={styles.Icon} name="arrow_back" />
				</button>
				<button onClick={() => goToNextMonth()} disabled={forwardDisabled || transitioning}>
					<Icon className={styles.Icon} name="arrow_forward" />
				</button>
			</div>
		</div>
	);

}