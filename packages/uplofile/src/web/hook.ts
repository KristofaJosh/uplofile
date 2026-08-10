import {
  useUplofile as useUplofileShared,
  useUplofileStable as useUplofileStableShared,
} from "../shared/hook";

export const useUplofile = <TMeta = any, TFileSource = File>() =>
  useUplofileShared<TMeta, TFileSource>();

export const useUplofileStable = <TMeta = any, TFileSource = File>() =>
  useUplofileStableShared<TMeta, TFileSource>();
