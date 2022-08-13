import { FieldProps } from 'formik';
import React from 'react';
import { Form } from 'react-bootstrap';
import styles from '../../styles/InputField.module.css'

interface userName {
    type: string,
    label: string,
    placeholder: string,
    readonly?: boolean,
}

function InputField(props: FieldProps & userName) {
    const {
        field, form,
        type, label, placeholder, readonly
    } = props
    const { name } = field
    const { errors, touched }: { errors: any, touched: any } = form
    return (
        <div >
            <Form.Group controlId={name} className={styles.text}>
                {label && <Form.Label >{label}</Form.Label>}
                <Form.Control
                    type={type}
                    placeholder={placeholder}
                    isInvalid={touched[name] && !!errors[name]}
                    readOnly={readonly}
                    {...field}
                    className={styles.input}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
            </Form.Group>

        </div>
    );
}

export default InputField;