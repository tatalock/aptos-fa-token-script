function hex2a(hexx: number | string) {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
export const pairedCoinToAssetType = (data: any) => {
  if (!data?.account_address) return "";
  return [
    data.account_address,
    hex2a(data.module_name.replace("0x", "")),
    hex2a(data.struct_name.replace("0x", "")),
  ].join("::");
};
