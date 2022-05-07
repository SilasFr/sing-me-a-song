import {
 CreateRecommendationData 
} from "../services/recommendationsService.js";
import joi from "joi";

const youtubeLinkRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

export const recommendationSchema = joi.object<CreateRecommendationData>({
  name: joi.string().required(),
  youtubeLink: joi.string().required().pattern(youtubeLinkRegex),
});
