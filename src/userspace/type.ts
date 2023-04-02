import { AloneUserSpace, DB } from "@/ts_pkc/ts-baselib"

export type UserSpace = AloneUserSpace & { globalDB: DB }