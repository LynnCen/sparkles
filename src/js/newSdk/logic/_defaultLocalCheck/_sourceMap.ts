const AvatarObjectId = (name: string) => `avatar/default/${name}`;

const assemblyAvatar = (data: { [key: string]: string }) => {
    const _d = { ...data };

    for (let i = 1; i <= 18; i++) {
        _d[AvatarObjectId(`${i}`)] = `./tmmDefaultSource/avatar/${i}.jpg`;
    }

    return _d;
};

export const SourceMap = assemblyAvatar({});
export default SourceMap;
