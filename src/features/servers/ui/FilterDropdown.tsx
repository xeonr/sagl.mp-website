import * as React from 'react';
import { SelectPicker } from 'rsuite';
// @ts-ignore
import { PlacementType } from 'rsuite/lib/Notification';
import { statisticsClient } from '../../../api-types/client';

const render = (render: React.ReactNode, data: any) => {
	return (
		<>
			{render}
			&nbsp; ({data.count})
		</>
	)
};


export const FilterDropdown = React.memo((props: {
	label: string; serverKey: keyof typeof statisticsClient; dataKey: string; displayKey: string; valueKey: string; transformer?: (value: string) => string,
	value: string; onChange?(value?: string): void;
	align: PlacementType;
}) => {
	const [data, setData] = React.useState([]);

	const onGetCountries = React.useCallback(() => {
		(statisticsClient as any)[props.serverKey]({})
			.then((res: any) => {
				return res[props.dataKey].map((i: any) => ({
					label: props.transformer ? props.transformer(i[props.valueKey]) : i[props.displayKey],
					value: i[props.valueKey],
					count: i.count,
				})).filter((i: any) => !!i.value);
			})
			.then((res: any) => setData(res))
	}, [props]);

	const onChange = React.useCallback((value: string) => {
		if (props.onChange) {
			props.onChange(value);
		}
	}, [props.onChange]); // eslint-disable-line

	const onClear = React.useCallback(() => {
		if (props.onChange) {
			props.onChange();
		}
	}, [props.onChange]); // eslint-disable-line

	React.useEffect(() => {
		if (props.value && !data.length) {
			onGetCountries();
		}
	}, [!!props.value, data, onGetCountries]);

	return (
		<SelectPicker
			style={{ marginRight: 10 }}
			value={props.value ?? null}
			data={data}
			onOpen={onGetCountries}
			renderMenuItem={render}
			placeholder={props.label}
			onClean={onClear}
			onSelect={onChange}
			placement={props.align}
		>
		</SelectPicker>
	)
})
