import { PlusOutlined } from '@ant-design/icons';
import {
  Alert,
  App,
  Button,
  Flex,
  Input,
  Popconfirm,
  Space,
  Table,
  type TableColumnsType,
} from 'antd';
import { type ReactNode, useEffect, useState } from 'react';

interface CrudTableProps<T> {
  columns: TableColumnsType<T>;
  data: T[] | undefined;
  loading?: boolean;
  error?: Error | null;
  searchKeys: (keyof T)[];
  searchPlaceholder?: string;
  createButtonText?: string;
  onCreate: () => void;
  onEdit: (record: T) => void;
  onDelete: (record: T) => Promise<unknown>;
  toolbar?: ReactNode;
}

export function CrudTable<T extends { id: string }>({
  columns,
  data = [],
  loading,
  error,
  searchKeys,
  searchPlaceholder = '输入关键字搜索',
  createButtonText = '新建',
  onCreate,
  onEdit,
  onDelete,
  toolbar,
}: CrudTableProps<T>) {
  const { message } = App.useApp();
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (error) message.error(error.message);
  }, [error, message]);

  const needle = keyword.trim().toLowerCase();
  const rows = needle
    ? data.filter((row) =>
        searchKeys.some((key) =>
          String(row[key] ?? '')
            .toLowerCase()
            .includes(needle),
        ),
      )
    : data;
  // Deleting the last row of a page must not leave the table on an empty page.
  const current = Math.min(page, Math.max(1, Math.ceil(rows.length / pageSize)));

  const actionColumn: TableColumnsType<T>[number] = {
    title: '操作',
    key: 'actions',
    width: 140,
    render: (_, record) => (
      <Space>
        <Button type="link" size="small" onClick={() => onEdit(record)}>
          编辑
        </Button>
        <Popconfirm
          title="确定删除这条记录吗？"
          okText="删除"
          cancelText="取消"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDelete(record)}
        >
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Popconfirm>
      </Space>
    ),
  };

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between" gap="middle" wrap>
        <Input.Search
          allowClear
          aria-label="搜索"
          placeholder={searchPlaceholder}
          style={{ maxWidth: 320 }}
          value={keyword}
          onChange={(event) => {
            setKeyword(event.target.value);
            setPage(1);
          }}
        />
        <Space>
          {toolbar}
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            {createButtonText}
          </Button>
        </Space>
      </Flex>
      {error && <Alert type="error" showIcon message={error.message} />}
      <Table<T>
        rowKey="id"
        columns={[...columns, actionColumn]}
        dataSource={rows}
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          current,
          pageSize,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (nextPage, nextSize) => {
            setPage(nextPage);
            setPageSize(nextSize);
          },
        }}
      />
    </Flex>
  );
}
