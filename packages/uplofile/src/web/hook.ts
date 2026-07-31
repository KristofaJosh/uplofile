import { useUplofile as useUplofileShared } from "../shared/hook";

export const useUplofile = <TMeta = any, TFileSource = File>() =>
  useUplofileShared<TMeta, TFileSource>();
