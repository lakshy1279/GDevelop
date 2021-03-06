import React from 'react';
import { ListItem } from '../UI/List';
import TextField, {
  noMarginTextFieldInListItemTopOffset,
} from '../UI/TextField';
import ThemeConsumer from '../UI/Theme/ThemeConsumer';

type Props = {|
  group: gdObjectGroup,
  style: Object,
  onEdit: ?(gdObjectGroup) => void,
  onEditName: () => void,
  onDelete: () => void,
  onRename: string => void,
  editingName: boolean,
  isGlobalGroup: boolean,
  canSetAsGlobalGroup?: boolean,
|};

const styles = {
  groupName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  textField: {
    top: noMarginTextFieldInListItemTopOffset,
  },
};

export default class GroupRow extends React.Component<Props, {||}> {
  componentDidUpdate(prevProps) {
    if (!prevProps.editingName && this.props.editingName) {
      setTimeout(() => {
        if (this.textField) this.textField.focus();
      }, 100);
    }
  }

  render() {
    const { group, style, isGlobalGroup } = this.props;

    const groupName = group.getName();
    const label = this.props.editingName ? (
      <TextField
        id="rename-object-field"
        margin="none"
        ref={textField => (this.textField = textField)}
        defaultValue={groupName}
        onBlur={e => this.props.onRename(e.target.value)}
        onKeyPress={event => {
          if (event.charCode === 13) {
            // enter key pressed
            this.textField.blur();
          }
        }}
        fullWidth
        style={styles.textField}
      />
    ) : (
      <div
        style={{
          ...styles.groupName,
          fontStyle: isGlobalGroup ? 'italic' : undefined,
          fontWeight: isGlobalGroup ? 'bold' : 'normal',
        }}
      >
        {groupName}
      </div>
    );

    return (
      <ThemeConsumer>
        {muiTheme => (
          <ListItem
            style={{
              borderBottom: `1px solid ${muiTheme.listItem.separatorColor}`,
              ...style,
            }}
            primaryText={label}
            displayMenuButton
            buildMenuTemplate={() => [
              {
                label: 'Edit group',
                click: () => this.props.onEdit(group),
              },
              {
                label: 'Set as Global group',
                enabled: !this.props.isGlobalGroup,
                click: () => this.props.onSetAsGlobalGroup(),
                visible: this.props.canSetAsGlobalGroup !== false,
              },
              {
                label: 'Rename',
                enabled: !!this.props.onEdit,
                click: () => this.props.onEditName(),
              },
              {
                label: 'Delete',
                enabled: !!this.props.onEdit,
                click: () => this.props.onDelete(),
              },
            ]}
            onClick={() => {
              // It's essential to discard clicks when editing the name,
              // to avoid weird opening of an editor when clicking on the
              // text field.
              if (!this.props.editingName) this.props.onEdit(group);
            }}
          />
        )}
      </ThemeConsumer>
    );
  }
}
