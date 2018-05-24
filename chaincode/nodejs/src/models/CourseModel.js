

const createCourseModel = ({name, reference, website, characteristics, competences, start, providerId, isValid}) => {

    return {
        name,
        reference,
        website,
        characteristics,
        competences,
        start,
        providerId,
        isValid
    };
};

export { createCourseModel };