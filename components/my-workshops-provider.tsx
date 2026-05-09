"use client";

import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  readStoredWorkshopFlows,
  writeStoredWorkshopFlows,
  type StoredWorkshopFlow,
} from "@/lib/my-workshops-store";

interface MyWorkshopsContextValue {
  items: StoredWorkshopFlow[];
  upsertWorkshopFlow: (item: StoredWorkshopFlow) => void;
  getWorkshopFlowByWorkshopId: (
    workshopId: number,
  ) => StoredWorkshopFlow | undefined;
}

const MyWorkshopsContext = createContext<MyWorkshopsContextValue | null>(null);

export function MyWorkshopsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StoredWorkshopFlow[]>(() =>
    readStoredWorkshopFlows(),
  );

  useEffect(() => {
    writeStoredWorkshopFlows(items);
  }, [items]);

  const upsertWorkshopFlow = useCallback((item: StoredWorkshopFlow) => {
    setItems((current) => {
      const next = current.filter(
        (existing) => existing.workshop.id !== item.workshop.id,
      );

      next.unshift(item);
      return next;
    });
  }, []);

  const getWorkshopFlowByWorkshopId = useCallback(
    (workshopId: number) =>
      items.find((item) => Number(item.workshop.id) === Number(workshopId)),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      upsertWorkshopFlow,
      getWorkshopFlowByWorkshopId,
    }),
    [getWorkshopFlowByWorkshopId, items, upsertWorkshopFlow],
  );

  return (
    <MyWorkshopsContext.Provider value={value}>
      {children}
    </MyWorkshopsContext.Provider>
  );
}

export function useMyWorkshops() {
  const context = useContext(MyWorkshopsContext);

  if (!context) {
    throw new Error("useMyWorkshops must be used within MyWorkshopsProvider");
  }

  return context;
}
