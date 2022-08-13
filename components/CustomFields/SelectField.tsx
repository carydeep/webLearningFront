import { FieldProps } from 'formik';
import React from 'react';
import { Form } from 'react-bootstrap';
import styles from '../../styles/SelectField.module.css'

interface selectField {
    label: string,
    options: Array<any>,
    labelOptions: string,
}

function SelectField(props: FieldProps & selectField) {
    const {
        field, form,
        label, options, labelOptions
    } = props
    const { name } = field
    const { touched, errors }:{touched:any,errors:any} = form
    return (
        <Form.Group className={styles.container}>
            <Form.Label>{label}</Form.Label>
            <Form.Select
                aria-label="Default select example"
                className={styles.select}
                isInvalid={touched[name] && !!errors[name]}
                {...field}
            >
                <option value="">{labelOptions}</option>
                {options.map(({ value, name }) => {
                    return (
                        <option key={value} value={value}>{name}</option>
                    )
                })}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
        </Form.Group>
    );
}

export default SelectField;