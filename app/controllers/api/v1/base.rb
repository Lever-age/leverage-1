class FundingSerializer < ActiveModel::Serializer
  attributes :candidate, :donorType, :amount, :position
end

module Api
  module V1
    class Base < Grape::API
      default_format :json
      format :json
      formatter :json, Grape::Formatter::ActiveModelSerializers

      get :funding do
        render Funding.all
        #render Funding.where(:donorType => params[:donorType])
      end
    end
  end
end