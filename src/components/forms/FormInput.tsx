import { faEye } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { InputHTMLAttributes, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Control, FieldErrors } from "react-hook-form";

interface PasswordInputProps {
  name: string;
  placeholder?: string;
  refCallback?: any;
  errors: FieldErrors;
  control?: Control<any>;
  register?: any;
  className?: string;
  textGroup?: any;
}

/* Password Input */
const PasswordInput = ({
  name,
  placeholder,
  refCallback,
  errors,
  control,
  register,
  className,
  textGroup
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      <InputGroup className="mb-0">
        {!!textGroup && <InputGroup.Text>{textGroup}</InputGroup.Text>}
        <Form.Control
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          id={name}
          as="input"
          ref={(r: HTMLInputElement) => {
            if (refCallback) refCallback(r);
          }}
          className={className}
          isInvalid={errors && errors[name] ? true : false}
          {...(register ? register(name) : {})}
          autoComplete={name}
        />
        <div
          className={classNames("input-group-text", "input-group-password", "cursor-pointer", {
            "show-password": showPassword,
          })}
          data-password={showPassword ? "true" : "false"}
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        >
          <FontAwesomeIcon icon={faEye} />

        </div>
      </InputGroup>
    </>
  );
};

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  name: string;
  placeholder?: string;
  register?: any;
  errors?: FieldErrors;
  control?: Control<any>;
  className?: string;
  labelClassName?: string;
  containerClass?: string;
  refCallback?: any;
  children?: any;
  rows?: string;
  readOnly?: boolean;
  value?: any;
  disabled?: boolean;
  textGroup?: any;
}

const FormInput = ({
  label,
  type,
  name,
  placeholder,
  register,
  errors,
  control,
  className,
  labelClassName,
  containerClass,
  refCallback,
  children,
  rows,
  value,
  readOnly,
  disabled,
  textGroup,
  ...otherProps
}: FormInputProps) => {
  // handle input type

  const comp =
    type === "textarea" ? "textarea" : type === "select" ? "select" : "input";
  return (
    <>
      {type === "hidden" ? (
        <input
          type={type}
          name={name}
          onInput={""}
          {...(register ? register(name) : {})}
          {...otherProps}
        />
      ) : (
        <>
          {type === "password" ? (
            <>
              <Form.Group className={containerClass}>
                {label ? (
                  <>
                    <Form.Label className={labelClassName}>{label}</Form.Label>
                    {children}
                  </>
                ) : null}
                <PasswordInput
                  name={name}
                  placeholder={placeholder}
                  refCallback={refCallback}
                  errors={errors!}
                  register={register}
                  className={className}
                  textGroup={textGroup}
                />
                {errors && errors[name] ? (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    <>{errors?.[name]?.["message"]}</>
                  </Form.Control.Feedback>
                ) : null}
              </Form.Group>
            </>
          ) : (
            <>
              {type === "checkbox" || type === "radio" ? (
                <>
                  <Form.Group className={containerClass}>
                    <Form.Check
                      type={type}
                      label={label}
                      name={name}
                      id={name}
                      value={value}
                      readOnly={readOnly}
                      ref={(r: HTMLInputElement) => {
                        if (refCallback) refCallback(r);
                      }}
                      className={className}
                      isInvalid={errors && errors[name] ? true : false}
                      {...(register ? register(name) : {})}
                      {...otherProps}
                      disabled={disabled}
                    />

                    {errors && errors[name] ? (
                      <Form.Control.Feedback type="invalid">
                        <>{errors?.[name]?.["message"]}</>
                      </Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                </>
              ) : (
                <Form.Group className={containerClass}>
                  {label ? (
                    <Form.Label className={labelClassName}>{label}</Form.Label>
                  ) : null}
                  <InputGroup>
                    {!!textGroup && <InputGroup.Text>{textGroup}</InputGroup.Text>}
                    <Form.Control
                      type={type}
                      placeholder={placeholder}
                      name={name}
                      id={name}
                      maxLength={255}
                      as={comp}
                      ref={(r: HTMLInputElement) => {
                        if (refCallback) refCallback(r);
                      }}
                      className={className}
                      isInvalid={errors && errors[name]}
                      {...(register ? register(name) : {})}
                      rows={rows}
                      {...otherProps}
                      autoComplete={name}
                    >
                      {children ? children : null}
                    </Form.Control>
                  </InputGroup>
                  {errors && !!errors[name] ? (
                    <Form.Control.Feedback type="invalid" className="d-block">
                      <>{errors?.[name]?.["message"]}</>
                    </Form.Control.Feedback>
                  ) : null}
                </Form.Group>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default FormInput;
