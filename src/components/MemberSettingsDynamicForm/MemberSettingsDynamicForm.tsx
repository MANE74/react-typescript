import * as React from 'react';
import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';
import { TextField } from '../TextField/TextField';

export interface DynamicFormFieldType {
  //type?:   Pick<React.HTMLInputTypeAttribute, "text">; weird error with any explanation ?
  type?: 'text';
  placeHolder: string;
  placeHoldertx?: string;
  value: string;
  visible: boolean;
  editable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onClick?: (e: React.SyntheticEvent) => void;
}

interface STextFieldParams {
  $clickable?: boolean;
}

const STextField = styled(TextField)<STextFieldParams>`
  margin-bottom: 0.625rem;

  input {
    ${props =>
      props.$clickable &&
      css`
        :hover {
          cursor: pointer;
        }
      `}
    color: ${palette.white};
    font-family: 'Roboto-Regular';
    font-weight: 400;
    font-size: 0.9rem;
  }
`;
interface IMemberSettingsDynamicFormProps {
  fields: DynamicFormFieldType[];
  style?: React.CSSProperties;
  handlePhoneClick?: (phone: string) => void;
  handleEmailClick?: (email: string) => void;
}

const MemberSettingsDynamicForm = (props: IMemberSettingsDynamicFormProps) => {
  const { fields, style } = props;
  return (
    <div style={style}>
      {fields.map((field, index) => {
        return field.visible ? (
          <STextField
            key={String(index)}
            type={field.type || 'text'}
            value={field.value || ''}
            disabled={!field.editable || false}
            onChange={field.onChange}
            onBlur={field.onBlur}
            readOnly={!field.onChange}
            placeholder={field.placeHolder}
            touched={false}
            onClick={field.onClick}
            $clickable={!!field.onClick}
          />
        ) : null;
      })}
    </div>
  );
};

export default MemberSettingsDynamicForm;
