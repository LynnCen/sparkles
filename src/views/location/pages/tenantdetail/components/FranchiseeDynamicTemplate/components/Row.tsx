/**
 * @Description 表格行
 */
import React, { FC } from 'react';
import { Space, Form } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { dynamicTemplateAddGroup } from '@/common/api/location';
// import cs from 'classnames';
import styles from './index.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import ShowMore from '@/common/components/Data/ShowMore';
import FormInput from '@/common/components/Form/FormInput';

const Row: FC<any> = ({
  children,
  templateId,
  loadData,
  ...props
}) => {
  const [form] = Form.useForm();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props['data-row-key'],
  });
  // const { setEditGroup }: any = useContext(WFC);

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 99 } : {}),
  };

  const changeName = (id: number) => {
    form.validateFields().then((values: any) => {
      const params = {
        templateId,
        ...values,
        id,
      };
      dynamicTemplateAddGroup(params).then(() => {
        loadData && loadData();
      });
    });
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as any).key === 'categoryName') {
          const record = (child as any).props.record;
          form.setFieldValue('name', record.name);
          return React.cloneElement(child as any, {
            children: (
              <Space direction='horizontal'>
                <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{ touchAction: 'none', cursor: 'move' }}
                  {...listeners}
                />
                {record?.isGroup && (
                  <Space size={10}>
                    <Form
                      validateTrigger={['onChange', 'onBlur']}
                      form={form}
                    >
                      <V2DetailItem
                        allowEdit
                        value={<ShowMore maxWidth='100px' text={record.name} />}
                        className={styles.customDetailItem}
                        valueStyle={{
                          marginTop: '0px',
                          fontWeight: 'bold',
                          background: 'transparent',
                        }}
                        editConfig={{
                          formCom: (
                            <FormInput
                              config={{
                                style: {
                                  width: '130px',
                                  height: '32px',
                                  padding: '6px 8px',
                                  fontWeight: 'bold',
                                  background: 'transparent',
                                },
                                value: record.name,
                              }}
                              name='name'
                            />
                          ),
                          onCancel() {
                            form.setFieldValue('name', record.name);
                          },
                          onOK() {
                            changeName(record?.id);
                          },
                        }}
                      />
                    </Form>
                  </Space>
                )}
              </Space>
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

export default Row;
