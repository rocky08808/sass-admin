import { App } from 'antd';
import { useState } from 'react';

interface Options<V> {
  save: (input: { id?: string; values: V }) => Promise<unknown>;
  remove: (id: string) => Promise<unknown>;
}

/** Drawer state plus save/delete feedback shared by every CRUD page. */
export function useCrudPage<T extends { id: string }, V>({ save, remove }: Options<V>) {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T>();

  const show = (record?: T) => {
    setEditing(record);
    setOpen(true);
  };

  return {
    open,
    editing,
    openCreate: () => show(),
    openEdit: (record: T) => show(record),
    close: () => setOpen(false),
    submit: async (values: V) => {
      try {
        await save({ id: editing?.id, values });
        message.success(editing ? '已更新' : '已创建');
        setOpen(false);
      } catch (error) {
        message.error((error as Error).message);
      }
    },
    destroy: async (record: T) => {
      try {
        await remove(record.id);
        message.success('已删除');
      } catch (error) {
        message.error((error as Error).message);
      }
    },
  };
}
